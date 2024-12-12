import { useEffect, useState } from 'preact/hooks';
import type { NullableNumber } from '../../types/general';
import { fromFilter, toFilter } from '../DtGridUtils/filters';
import type {
	DtGridFilterProps,
	InnFilterIdx,
	NullableInnFilterIdx,
} from '../types/DtGridTypes';
import { DtGridFilterRow } from './DtGridFilterRow';
import { DtGridFilterRowEditor } from './DtGridFilterRowEditor';

const NO_EDITING = null;
const ADDING = -1;

export function DtGridFilter({
	columnConfig,
	initialFilters = [],
	onChange,
}: DtGridFilterProps) {
	const [btnMsg, setBtnMsg] = useState<string>('Add Filter');
	const [filters, setFilters] = useState<InnFilterIdx[]>(
		initialFilters.map((f) => fromFilter(columnConfig, f)),
	);
	const [editingFilter, setEditingFilter] =
		useState<NullableInnFilterIdx>(NO_EDITING);
	const [editingIdx, setEditingIdx] = useState<NullableNumber>(NO_EDITING);

	useEffect(() => {
		if (filters?.length > 0) {
			setBtnMsg('AND New Filter');
		}
	}, [filters?.length]);

	const handleAddFilter = () => {
		setEditingFilter({
			ColIdx: null,
			TypeIdx: null,
			Value: null,
			asType: null,
		});
		setEditingIdx(ADDING);
	};

	const handleEditFilter = (index) => {
		setEditingFilter(filters[index]);
		setEditingIdx(index);
	};

	const handleDeleteFilter = (index) => {
		const newFilters = filters.filter((_, i) => i !== index);
		setFilters(newFilters);
		onChange(newFilters.map((f) => toFilter(columnConfig, f)));
	};

	const handleSaveFilter = (filter) => {
		const newFilters = [...filters];
		if (editingIdx === ADDING) {
			newFilters.push(filter);
		} else if (editingIdx > ADDING) {
			newFilters[editingIdx] = filter;
		} else {
			console.error('Invalid editing index', editingIdx, filter);
		}
		setFilters(newFilters);
		setEditingFilter(NO_EDITING);
		setEditingIdx(NO_EDITING);
		onChange(newFilters.map((f) => toFilter(columnConfig, f)));
	};

	return (
		<div class="container">
			<div class="row d-flex justify-content-center">
				{filters.map((filter, index) => (
					<div key={index} class="row mb-2">
						{editingIdx === index ? (
							<DtGridFilterRowEditor
								columnList={columnConfig}
								filterVal={editingFilter}
								onChange={handleSaveFilter}
							/>
						) : (
							<DtGridFilterRow
								columnList={columnConfig}
								filterVal={filter}
								onDelete={() => handleDeleteFilter(index)}
								onEdit={() => handleEditFilter(index)}
							/>
						)}
					</div>
				))}
				{editingIdx === ADDING && (
					<DtGridFilterRowEditor
						columnList={columnConfig}
						filterVal={editingFilter}
						onChange={handleSaveFilter}
					/>
				)}
				{editingIdx === NO_EDITING && (
					<div class="col d-flex flex-row justify-content-center">
						<button
							class="btn btn-primary"
							type="button"
							onClick={handleAddFilter}
						>
							{btnMsg}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
