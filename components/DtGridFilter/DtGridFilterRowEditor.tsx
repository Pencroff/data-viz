import {
	type DtGridFilterRowEditorProps,
	FilterAsType,
	type InnFilterIdx,
} from '$cmp/types/DtGridTypes';
import { useFirstRender } from '$lib/hooks';
import { useEffect, useState } from 'preact/hooks';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import type { NullableNumber } from '../../types/general';
import { filters as fltr } from '../DtGridUtils';
import { DtGridFilterDropdown } from './DtGridFilterDropdown';

export function DtGridFilterRowEditor({
	columnList,
	filterVal,
	onChange,
}: DtGridFilterRowEditorProps) {
	const isFirstRender = useFirstRender();
	const [filter, setFilter] = useState<InnFilterIdx>({ ...filterVal });
	const [colIdx, setColIdx] = useState<NullableNumber>(filterVal.ColIdx);
	const [column, setColumn] = useState(columnList[colIdx]);
	const [fltIdx, setFltIdx] = useState<NullableNumber>(filterVal.TypeIdx);
	const [val, setVal] = useState(filterVal.Value);
	const [asType, setAsType] = useState(filterVal.asType);

	// biome-ignore lint/correctness/useExhaustiveDependencies: requires update for index changes
	useEffect(() => {
		console.log('DtGridFilterRowEditor', { colIdx, fltIdx, val });
		if (isFirstRender) {
			return;
		}
		let f = filter;
		if (f?.ColIdx !== colIdx) {
			setColumn(columnList[colIdx]);
			setAsType(columnList[colIdx].filterAs);
		}
		if (f) {
			f.ColIdx = colIdx;
			f.TypeIdx = fltIdx;
			f.Value = val;
			f.asType = asType;
		} else {
			f = {
				ColIdx: colIdx,
				TypeIdx: fltIdx,
				Value: val,
				asType: asType,
			};
			setFilter(f);
		}
		if (f.ColIdx !== null && f.TypeIdx !== null && f.Value !== null) {
			onChange(f);
		}
	}, [colIdx, fltIdx, val]);

	const handleColChange = (idx) => {
		setColIdx(idx);
		setColumn(columnList[idx]);
		setAsType(columnList[idx].filterAs);
		setFltIdx(null);
		setVal(null);
	};
	const handleFltChange = (idx) => {
		setFltIdx(idx);
	};
	const handleValueChange = (v: string) => {
		let r: number | string = v;
		if (asType === FilterAsType.asNumber || asType === FilterAsType.asEnum) {
			r = Number.parseFloat(v);
		}
		console.log('handleValueChange', r);
		setVal(r);
	};

	return (
		<div>
			<div class="row">
				<div class="col col-sm-3">
					<DtGridFilterDropdown
						label="Column"
						valueList={columnList}
						value={colIdx}
						onChange={handleColChange}
						resolveView={(v) => v.title}
					/>
				</div>
				<div class="col col-sm-4">
					<DtGridFilterDropdown
						label="Compare"
						valueList={column?.filterComparison}
						value={fltIdx}
						onChange={handleFltChange}
						resolveView={(v) => v[fltr.comparisonTitleIdx]}
					/>
				</div>
				<div class="col col-sm-5">
					{asType === FilterAsType.asEnum ? (
						<DtGridFilterDropdown
							label="Value"
							valueList={column?.filterValues}
							value={val}
							onChange={handleValueChange}
							resolveView={(v) => v}
						/>
					) : (
						<FloatingLabel controlId="floatingInput" label="Value">
							<Form.Control
								type="text"
								placeholder="Value"
								value={val}
								disabled={!column}
								onKeyDown={(e: KeyboardEvent) => {
									if (e.key === 'Enter')
										handleValueChange((e.target as HTMLInputElement).value);
								}}
							/>
						</FloatingLabel>
					)}
				</div>
			</div>
		</div>
	);
}
