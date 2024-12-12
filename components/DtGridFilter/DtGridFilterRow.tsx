import { IconEdit, IconTrash } from '@tabler/icons-preact';
import { useEffect, useState } from 'preact/hooks';
import { comparisonTitleIdx } from '../DtGridUtils/filters';
import { type DtGridFilterRowProps, FilterAsType } from '../types/DtGridTypes';

export function DtGridFilterRow({
	columnList,
	filterVal,
	onDelete,
	onEdit,
}: DtGridFilterRowProps) {
	console.log('DtGridFilterRow', { columnList, filterVal });
	const [f, setF] = useState({ col: '-', fltr: '-', val: '-' });
	useEffect(() => {
		if (columnList && filterVal) {
			const { ColIdx, TypeIdx, Value } = filterVal;
			const c = columnList[ColIdx];
			const col = c.title;
			const fltr = c.filterComparison[TypeIdx][comparisonTitleIdx];
			const val =
				filterVal.asType === FilterAsType.asEnum
					? c.filterValues[Value]
					: Value;
			setF({ col, fltr, val });
		}
	}, [columnList, filterVal]);
	return (
		<div class="d-flex flex-row">
			<div class="me-auto p-2">
				{f.col}&nbsp;{f.fltr}&nbsp;{f.val}
			</div>
			<button
				class="btn btn-outline-success me-4"
				type="button"
				title="edit"
				onClick={onEdit}
			>
				<IconEdit stroke={1.25} />
			</button>
			<button
				class="btn btn-outline-warning"
				type="button"
				title="delete"
				onClick={onDelete}
			>
				<IconTrash stroke={1.25} />
			</button>
		</div>
	);
}
