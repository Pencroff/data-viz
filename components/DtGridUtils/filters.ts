import type { ColumnDefinition } from 'tabulator-tables';
import {
	FilterAsType,
	type InnColumnDefinition,
	type InnFilter,
	type InnFilterDefinition,
	type InnFilterIdx,
	type InnFilterType,
} from '../types/DtGridTypes';

export const comparisonTitleIdx = 0;
export const comparisonValueIdx = 1;
export const comparisonAllList: [string, InnFilterType][] = [
	['Equal', '='],
	['Not Equal', '!='],
	['Less Than', '<'],
	['Less Than Or Equal To', '<='],
	['Greater Than', '>'],
	['Greater Than Or Equal To', '>='],
	['Like', 'like'],
	['Keywords', 'keywords'],
	['Starts With', 'starts'],
	['Ends With', 'ends'],
	['In Array', 'in'],
	['Regex', 'regex'],
];
export const comparisonNumberList: [string, InnFilterType][] = [
	['Equal', '='],
	['Not Equal', '!='],
	['Less Than', '<'],
	['Less Than Or Equal To', '<='],
	['Greater Than', '>'],
	['Greater Than Or Equal To', '>='],
];

export const comparisonStringList: [string, InnFilterType][] = [
	['Equal', '='],
	['Not Equal', '!='],
	['Like', 'like'],
	['Keywords', 'keywords'],
	['Starts With', 'starts'],
	['Ends With', 'ends'],
];

export const comparisonEnumList: [string, InnFilterType][] = [
	['Equal', '='],
	['Not Equal', '!='],
	['Like', 'like'],
	['Keywords', 'keywords'],
];

export function buildColumnList(
	columnsConfig: InnColumnDefinition[],
	data: unknown[],
): [ColumnDefinition[], InnFilterDefinition[]] {
	return columnsConfig.reduce(
		(acc, column) => {
			const [columnList, filterList] = acc;
			const { meta = {} } = column;
			const { filterAs } = meta;
			delete column.meta;
			const filterComparison =
				filterAs === FilterAsType.asEnum
					? comparisonEnumList
					: filterAs === FilterAsType.asNumber
						? comparisonNumberList
						: filterAs === FilterAsType.asString
							? comparisonStringList
							: comparisonAllList;

			let filterValues = null;
			if (filterAs === FilterAsType.asEnum) {
				const values = data.map((row) => row[column.field]);
				filterValues = Array.from(new Set(values));
			}

			columnList.push(column);
			filterList.push({
				title: column.title,
				field: column.field,
				filterAs: filterAs ?? null,
				filterComparison,
				filterValues,
			});
			return acc;
		},
		[[] as ColumnDefinition[], [] as InnFilterDefinition[]],
	);
}

export function fromFilter(
	columnConfig: InnFilterDefinition[],
	filter: InnFilter,
): InnFilterIdx {
	const colIdx = columnConfig.findIndex((col) => col.field === filter.field);
	if (colIdx === -1) {
		console.error('Invalid column field', filter.field);
		return { ColIdx: null, TypeIdx: null, Value: null, asType: null };
	}
	const col = columnConfig[colIdx];
	const typeIdx = col.filterComparison.findIndex(
		([, type]) => type === filter.type,
	);
	if (typeIdx === -1) {
		console.error('Invalid filter type', filter.type);
		return { ColIdx: null, TypeIdx: null, Value: null, asType: null };
	}
	const value =
		col.filterAs === FilterAsType.asEnum
			? col.filterValues.indexOf(filter.value)
			: (filter.value as number | string);
	return {
		ColIdx: colIdx,
		TypeIdx: typeIdx,
		Value: value,
		asType: col.filterAs,
	};
}

export function toFilter(
	columnConfig: InnFilterDefinition[],
	filter: InnFilterIdx,
): InnFilter {
	const col = columnConfig[filter.ColIdx];
	const field = col.field;
	const type = col.filterComparison[filter.TypeIdx][comparisonValueIdx];
	let value: unknown = filter.Value;
	if (col.filterAs === FilterAsType.asEnum) {
		value = col.filterValues?.[filter.Value as number] ?? null;
	}
	return { field, type, value };
}
