import { ChartBlock } from '$cmp/ChartBlock';
import type { Layout } from 'plotly.js';
import type {
	ColumnDefinition,
	FilterType,
	OptionsColumns,
} from 'tabulator-tables';

export type NullableInnFilterIdx = InnFilterIdx | null;

export type InnFilterIdx = {
	ColIdx: number | null;
	TypeIdx: number | null;
	Value: number | string | null;
	asType: FilterAsType | null;
};

export type InnFilterType = '' | 'keywords' | FilterType;

export type InnFilter = {
	field: string;
	type: InnFilterType;
	value: unknown;
};
export type NullableInnFilter = InnFilter | null;

export enum FilterAsType {
	asEnum = 'enum',
	asNumber = 'number',
	asString = 'string',
}

export type InnColumnDefinition = ColumnDefinition & {
	meta?: {
		filterAs?: FilterAsType;
	};
};

export type InnFilterDefinition = {
	title: string;
	field: string;
	filterAs: FilterAsType | null;
	filterComparison: [string, InnFilterType][];
	filterValues: unknown[] | null;
};

export type DtGridFilterType = InnFilter[];

export type DtGridFilterProps = {
	columnConfig: InnFilterDefinition[];
	initialFilters?: DtGridFilterType;
	onChange: (filters: InnFilter[]) => void;
};

export type DtGridBlockProps = {
	title: string;
	data: unknown[];
	columns: ColumnDefinition[];
	height?: string | number;
	filters?: DtGridFilterType;
	layout?: OptionsColumns['layout'];
	visibleFilters?: boolean;
};

export type DtGridProps = {
	data: unknown[];
	columns: ColumnDefinition[];
	height?: string | number;
	filters?: DtGridFilterType;
	layout?: OptionsColumns['layout'];
};

export type DtGridFilterRowProps = {
	columnList: InnFilterDefinition[];
	filterVal: InnFilterIdx;
	onDelete: () => void;
	onEdit: () => void;
};

export type DtGridFilterRowEditorProps = {
	columnList: InnFilterDefinition[];
	filterVal: InnFilterIdx;
	onChange: (v: InnFilterIdx) => void;
};

export type MapperFn = (
	data: unknown[],
	group,
) => {
	x: unknown[];
	y: unknown[];
};

export type ChartConfig = {
	title: string;
	listTitle: string;
	yLabel: string;
	description: string;
	charts: {
		type: string;
		group: string;
		mapper: string;
	}[];
	layout: Partial<Layout>;
};

export type ChartBlockProps = {
	rawData: unknown[];
	chartMap: Record<string, ChartConfig>;
	mappers: Record<string, MapperFn>;
};
