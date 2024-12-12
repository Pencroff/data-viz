import { useEffect, useRef, useState } from 'preact/hooks';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import './data-grid.scss';
import type { DtGridProps } from '../types/DtGridTypes';

export const DtGrid = ({
	columns = [],
	data = [],
	layout = 'fitColumns',
	height = '100%',
	filters = [],
}: DtGridProps) => {
	const tableRef = useRef(null);
	const [tabInstance, setTabInstance] = useState(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (tableRef.current) {
			const tab = new Tabulator(tableRef.current, {
				reactiveData: true,
				layout,
				height,
				data,
				columns,
			});
			setTabInstance(tab);
		}
		return () => {
			if (tabInstance) {
				tabInstance.destroy();
			}
		};
	}, [columns, layout, height]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: required to update filters
	useEffect(() => {
		tabInstance?.setFilter(filters);
	}, [filters]);

	return <div ref={tableRef} />;
};
