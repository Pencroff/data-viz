import { ChartBlock } from '$cmp/ChartBlock';
import { DtGridBlock } from '$cmp/DtGridBlock';
import { filters as fltr, formatters as fmt } from '$cmp/DtGridUtils';
import type { InnColumnDefinition } from '$cmp/types/DtGridTypes';
import { FilterAsType } from '$cmp/types/DtGridTypes';
import { useFirstRender } from '$lib';
import { groupBy, last, map, round } from 'lodash-es';
import data from '../data/benchmark_browser_2024-11-01.json5';

type WasmBrowserBenchmarkEntry = {
	env: string;
	engine: string;
	version: string;
	name: string;
	size: number;
	duration: number;
	alloc: number;
	sys: number;
	scale: number;
};

const columnsConfig: InnColumnDefinition[] = [
	{
		title: 'Browser',
		field: 'engine',
		meta: { filterAs: FilterAsType.asEnum },
	},
	{
		title: 'Version',
		field: 'version',
		headerSort: false,
		meta: { filterAs: FilterAsType.asString },
	},
	{
		title: 'Implementation',
		field: 'name',
		meta: { filterAs: FilterAsType.asEnum },
	},
	{
		title: 'Size',
		field: 'size',
		meta: { filterAs: FilterAsType.asNumber },
		formatter: fmt.formatMemorySize,
		formatterParams: {
			precision: 2,
			minUnit: 'KiB',
			maxUnit: 'MiB',
		},
	},
	{
		title: 'Duration',
		field: 'duration',
		meta: { filterAs: FilterAsType.asNumber },
		formatter: fmt.formatFloat,
		formatterParams: {
			precision: 2,
		},
	},
	{
		title: 'Allocated memory',
		field: 'alloc',
		meta: { filterAs: FilterAsType.asNumber },
		formatter: fmt.formatMemorySize,
		formatterParams: {
			precision: 2,
			minUnit: 'KiB',
			maxUnit: 'MiB',
		},
	},
	{
		title: 'Reserved memory',
		field: 'sys',
		meta: { filterAs: FilterAsType.asNumber },
		formatter: fmt.formatMemorySize,
		formatterParams: {
			precision: 2,
			minUnit: 'KiB',
			maxUnit: 'MiB',
		},
	},
	{
		title: 'Scale',
		field: 'scale',
		meta: { filterAs: FilterAsType.asNumber },
		formatter: fmt.formatFloat,
		formatterParams: {
			precision: 2,
		},
	},
];

export const App = () => {
	let gridData = [];
	if (useFirstRender()) {
		gridData = dtGridTransformData(data);
	}
	return (
		<div class="container">
			<div class="row">
				<div class="col">
					<ChartBlock
						rawData={gridData}
						chartMap={{
							scale: {
								listTitle: 'Browser scale',
								title: 'Browser scale, last version',
								yLabel: 'Scale',
								description:
									'Comparison with "Binary" baseline, lower is better',

								charts: [
									{ type: 'bar', group: 'safari', mapper: 'scaleMapper' },
									{ type: 'bar', group: 'chrome', mapper: 'scaleMapper' },
									{ type: 'bar', group: 'firefox', mapper: 'scaleMapper' },
									{ type: 'bar', group: 'edge', mapper: 'scaleMapper' },
									{ type: 'bar', group: 'arc', mapper: 'scaleMapper' },
								],
								layout: {
									height: 512,
									autosize: true,
									shapes: [
										{
											type: 'line',
											x0: 0,
											y0: 1,
											x1: 1,
											y1: 1,
											xref: 'paper',
											yref: 'y',
											line: {
												color: 'black',
												width: 2,
												dash: 'dash',
											},
										},
									],
									annotations: [
										{
											x: 0.5,
											y: 1.75,
											xref: 'paper',
											yref: 'y',
											text: 'Binary baseline',
											showarrow: false,
											font: {
												size: 16,
											},
										},
									],
								},
							},
							alloc: {
								listTitle: 'Allocated memory',
								title: 'Allocated memory, last version',
								yLabel: 'Memory',
								description: 'Memory allocated in KiB',
								charts: [
									{ type: 'bar', group: 'safari', mapper: 'memoryMapper' },
									{ type: 'bar', group: 'chrome', mapper: 'memoryMapper' },
									{ type: 'bar', group: 'firefox', mapper: 'memoryMapper' },
									{ type: 'bar', group: 'edge', mapper: 'memoryMapper' },
									{ type: 'bar', group: 'arc', mapper: 'memoryMapper' },
								],
								layout: {
									height: 512,
									autosize: true,
									yaxis: { type: 'log' },
								},
							},
						}}
						mappers={{
							scaleMapper: (data: unknown[], group: string) => {
								const groupedByEngine = groupBy(data, 'engine');
								const subSet = groupedByEngine[group];
								const groupedByName = groupBy(subSet, 'name');
								const x = Object.keys(groupedByName);
								const y = x.map((key) =>
									round(last(map(groupedByName[key], 'scale') as number[]), 2),
								);
								return { x, y };
							},
							memoryMapper: (data: unknown[], group: string) => {
								const groupedByEngine = groupBy(data, 'engine');
								const subSet = groupedByEngine[group];
								const groupedByName = groupBy(subSet, 'name');
								const x = Object.keys(groupedByName);
								const y = x.map((key) =>
									round(last(map(groupedByName[key], 'alloc')) / 1024, 2),
								);
								return { x, y };
							},
						}}
					/>
				</div>
			</div>
			<div class="row">
				<div class="col">&nbsp;</div>
			</div>
			<div class="row">
				<div class="col">
					<DtGridBlock
						title="Performance data"
						data={gridData}
						columns={columnsConfig}
					/>
				</div>
			</div>
		</div>
	);
};

function dtGridTransformData(data: WasmBrowserBenchmarkEntry[]) {
	return data.map((row) => {
		const nameFormatterMap = {
			sieve_primes: 'Binary',
			'sieve_primes.wasm': 'WASM',
			'sieve_primes.js': 'JS',
		};
		row.name = nameFormatterMap[row.name];
		return row;
	});
}
