import { ChartBlock } from '$cmp/ChartBlock';
import { DtGridBlock } from '$cmp/DtGridBlock';
import type { InnColumnDefinition } from '$cmp/types/DtGridTypes';
import { FilterAsType } from '$cmp/types/DtGridTypes';
import _ from 'lodash';
// @ts-ignore
import data from '../data/m2_out.json';

type SqliteBenchmarkEntry = {
	name: string;
	action: string;
	library: string;
	avg: number;
	median: number;
	implementation: string;
	driver: string;
};

const columnsConfig: InnColumnDefinition[] = [
	{
		title: 'Library',
		field: 'library',
		meta: { filterAs: FilterAsType.asEnum },
	},
	{
		title: 'Implementation',
		field: 'implementation',
		meta: { filterAs: FilterAsType.asEnum },
	},
	{
		title: 'Is db/sql driver',
		field: 'driver',
		meta: { filterAs: FilterAsType.asEnum },
	},
	{
		title: 'Test name',
		field: 'name',
		meta: { filterAs: FilterAsType.asEnum },
	},
	{
		title: 'SQL action',
		field: 'action',
		meta: { filterAs: FilterAsType.asEnum },
	},
	{
		title: 'Median',
		field: 'median',
		meta: { filterAs: FilterAsType.asNumber },
	},
];

export const App = () => {
	const gridData = dtGridTransformData(data);
	return (
		<div class="container">
			<div class="row">
				<div class="col">
					<ChartBlock
						rawData={gridData}
						chartMap={{
							simpleInsert: {
								listTitle: 'Simple insert',
								title: 'Simple insert',
								yLabel: 'Time, milliseconds',
								description: 'Time to insert 1,000,000 users',
								charts: [
									{
										type: 'bar',
										group: { name: '1_simple', action: 'insert' },
										mapper: 'generalMapper',
									},
								],
								layout: {
									autosize: true,
								},
							},
							simpleQuery: {
								listTitle: 'Simple query',
								title: 'Simple query',
								yLabel: 'Time, milliseconds',
								description: 'Time to query all (1,000,000) users once',
								charts: [
									{
										type: 'bar',
										group: { name: '1_simple', action: 'query' },
										mapper: 'generalMapper',
									},
								],
								layout: {
									autosize: true,
								},
							},
							complexInsert: {
								listTitle: 'Complex insert',
								title: 'Complex insert',
								yLabel: 'Time, milliseconds',
								description:
									'Insert 200 users in transaction, then insert 100 articles per user (20,000 total),<br>then 20 comments for each article (400,000 total)',
								charts: [
									{
										type: 'bar',
										group: { name: '2_complex', action: 'insert' },
										mapper: 'generalMapper',
									},
								],
								layout: {
									autosize: true,
								},
							},
							complexQuery: {
								listTitle: 'Complex query',
								title: 'Complex query',
								yLabel: 'Time, milliseconds',
								description:
									'Time to query all users (200), articles (20,000) and comments (400,000) once',
								charts: [
									{
										type: 'bar',
										group: { name: '2_complex', action: 'query' },
										mapper: 'generalMapper',
									},
								],
								layout: {
									autosize: true,
								},
							},
							many10Query: {
								listTitle: 'Many 10 query',
								title: 'Many 10 query',
								yLabel: 'Time, milliseconds',
								description:
									'Query all users (10) 1000 times, simulate a read-heavy use case',
								charts: [
									{
										type: 'bar',
										group: { name: '3_many/0010', action: 'query' },
										mapper: 'generalMapper',
									},
								],
								layout: {
									autosize: true,
								},
							},
							many100Query: {
								listTitle: 'Many 100 query',
								title: 'Many 100 query',
								yLabel: 'Time, milliseconds',
								description:
									'Query all users (100) 1000 times, simulate a read-heavy use case',
								charts: [
									{
										type: 'bar',
										group: { name: '3_many/0100', action: 'query' },
										mapper: 'generalMapper',
									},
								],
								layout: {
									autosize: true,
								},
							},
							many1000Insert: {
								listTitle: 'Many 1000 insert',
								title: 'Many 1000 insert',
								yLabel: 'Time, milliseconds',
								description: 'Insert 1000 users once',
								charts: [
									{
										type: 'bar',
										group: { name: '3_many/1000', action: 'insert' },
										mapper: 'generalMapper',
									},
								],
								layout: {
									autosize: true,
								},
							},
							many1000Query: {
								listTitle: 'Many 1000 query',
								title: 'Many 1000 query',
								yLabel: 'Time, milliseconds',
								description:
									'Query all users (1000) 1000 times, simulate a read-heavy use case',
								charts: [
									{
										type: 'bar',
										group: { name: '3_many/1000', action: 'query' },
										mapper: 'generalMapper',
									},
								],
								layout: {
									autosize: true,
								},
							},
							large50Insert: {
								listTitle: 'Large 50k insert',
								title: 'Large 50k insert',
								yLabel: 'Time, milliseconds',
								description:
									'Insert 10,000 users with 50,000 characters of content',
								charts: [
									{
										type: 'bar',
										group: { name: '4_large/050000', action: 'insert' },
										mapper: 'generalMapper',
									},
								],
								layout: {
									autosize: true,
								},
							},
							large50Query: {
								listTitle: 'Large 50k query',
								title: 'Large 50k query',
								yLabel: 'Time, milliseconds',
								description:
									'Query all users (10,000) with content, simulate a reading of large (~ 1Gb) database',
								charts: [
									{
										type: 'bar',
										group: { name: '4_large/050000', action: 'query' },
										mapper: 'generalMapper',
									},
								],
								layout: {
									autosize: true,
								},
							},
							large100Insert: {
								listTitle: 'Large 100k insert',
								title: 'Large 100k insert',
								yLabel: 'Time, milliseconds',
								description:
									'Insert 10,000 users with 100,000 characters of content',
								charts: [
									{
										type: 'bar',
										group: { name: '4_large/100000', action: 'insert' },
										mapper: 'generalMapper',
									},
								],
								layout: {
									autosize: true,
								},
							},
							large100Query: {
								listTitle: 'Large 100k query',
								title: 'Large 100k query',
								yLabel: 'Time, milliseconds',
								description:
									'Query all users (10,000) with content, simulate a reading of large (~ 2Gb) database',
								charts: [
									{
										type: 'bar',
										group: { name: '4_large/100000', action: 'query' },
										mapper: 'generalMapper',
									},
								],
								layout: {
									autosize: true,
								},
							},
							large200Insert: {
								listTitle: 'Large 200k insert',
								title: 'Large 200k insert',
								yLabel: 'Time, milliseconds',
								description:
									'Insert 10,000 users with 200,000 characters of content',
								charts: [
									{
										type: 'bar',
										group: { name: '4_large/200000', action: 'insert' },
										mapper: 'generalMapper',
									},
								],
								layout: {
									autosize: true,
								},
							},
							large200Query: {
								listTitle: 'Large 200k query',
								title: 'Large 200k query',
								yLabel: 'Time, milliseconds',
								description:
									'Query all users (10,000) with content, simulate a reading of large (~ 4Gb) database',
								charts: [
									{
										type: 'bar',
										group: { name: '4_large/200000', action: 'query' },
										mapper: 'generalMapper',
									},
								],
								layout: {
									autosize: true,
								},
							},
							// concurrent2Insert: {
							// 	listTitle: 'Insert 1,000,000 users',
							// 	title: 'Insert 1,000,000 users',
							// 	yLabel: 'Time, milliseconds',
							// 	description: 'Insert 1,000,000 users',
							// 	charts: [
							// 		{
							// 			type: 'bar',
							// 			group: { name: '5_concurrent/2', action: 'insert' },
							// 			mapper: 'generalMapper',
							// 		},
							// 	],
							// 	layout: {
							// 		autosize: true,
							// 	},
							// },
							concurrent2Query: {
								listTitle: 'Concurrent query, 2 goroutines',
								title: 'Concurrent query, 2 goroutines',
								yLabel: 'Time, milliseconds',
								description: 'Query all users (1,000,000) in 2 goroutines',
								charts: [
									{
										type: 'bar',
										group: { name: '5_concurrent/2', action: 'query' },
										mapper: 'generalMapper',
									},
								],
								layout: {
									autosize: true,
								},
							},
							concurrent4Query: {
								listTitle: 'Concurrent query, 4 goroutines',
								title: 'Concurrent query, 4 goroutines',
								yLabel: 'Time, milliseconds',
								description: 'Query all users (1,000,000) in 4 goroutines',
								charts: [
									{
										type: 'bar',
										group: { name: '5_concurrent/4', action: 'query' },
										mapper: 'generalMapper',
									},
								],
								layout: {
									autosize: true,
								},
							},
							concurrent8Query: {
								listTitle: 'Concurrent query, 8 goroutines',
								title: 'Concurrent query, 8 goroutines',
								yLabel: 'Time, milliseconds',
								description: 'Query all users (1,000,000) in 8 goroutines',
								charts: [
									{
										type: 'bar',
										group: { name: '5_concurrent/8', action: 'query' },
										mapper: 'generalMapper',
									},
								],
								layout: {
									autosize: true,
								},
							},
						}}
						mappers={{
							generalMapper,
						}}
						height={350}
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

function dtGridTransformData(data: SqliteBenchmarkEntry[]) {
	return data.reduce((acc, row) => {
		if (row.action !== 'dbsize') {
			acc.push(row);
		}
		return acc;
	}, [] as SqliteBenchmarkEntry[]);
}

function generalMapper(
	data: SqliteBenchmarkEntry[],
	group: { name: string; action: string; library: string },
) {
	const res = _.chain(data)
		.filter(group)
		.reduce(
			(
				acc: { x: string[]; y: number[]; marker?: { color: string[] } },
				el: SqliteBenchmarkEntry,
			) => {
				const label = `${el.library}<br>(${el.implementation})`;
				acc.x.push(label);
				acc.y.push(el.median);
				return acc;
			},
			{ x: [] as string[], y: [] as number[] },
		)
		.value();
	res.marker = {
		color: [
			'#003f5c',
			'#2f4b7c',
			'#665191',
			'#a05195',
			'#d45087',
			'#f95d6a',
			'#ff7c43',
			'#ffa600',
			'#00876c',
			'#3e976d',
			'#63a66f',
			'#86b572',
			'#a9c377',
			'#ccd07f',
			'#f0dd8b',
		],
	};
	return res;
}
