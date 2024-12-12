import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

export function DtGridFilterDropdown({
	label,
	valueList,
	value,
	onChange,
	resolveView,
	resolveKey = (c, idx) => idx,
}) {
	return (
		<FloatingLabel controlId="floatingSelect" label={label}>
			<Form.Select
				size="sm"
				aria-label={label}
				value={value}
				onChange={(e) => onChange(e.currentTarget.value)}
				disabled={!valueList}
			>
				<option value="">Select value ...</option>
				{valueList?.map((c, idx) => (
					<option key={resolveKey(c, idx)} value={idx}>
						{resolveView(c)}
					</option>
				))}
			</Form.Select>
		</FloatingLabel>
	);
}
