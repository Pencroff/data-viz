import { clone } from '$lib/util';
import { useEffect, useState } from 'preact/hooks';
import { DtGrid } from '../DtGrid';
import { filters as fltr } from '../DtGridUtils';
import './style.css';
import type { DtGridBlockProps } from '$cmp/types/DtGridTypes';
import { IconFilter } from '@tabler/icons-preact';
import { Modal } from 'react-bootstrap';
import { DtGridFilter } from '../DtGridFilter';

export function DtGridBlock({
	title = 'DataGridCmp',
	columns = [],
	data = [],
	layout = 'fitColumns',
	height = '100%',
	visibleFilters = true,
}: DtGridBlockProps) {
	const [columnList, setColumnList] = useState([]);
	const [columnConfig, setColumnConfig] = useState([]);
	const [filterList, setFilterList] = useState([]);
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	useEffect(() => {
		if (columns && data?.length > 0) {
			const l = clone(columns);
			const [clonedList, colConf] = fltr.buildColumnList(l, data);
			setColumnList(clonedList);
			setColumnConfig(colConf);
		}
	}, [columns, data]);

	const handleFilterChange = (filter) => {
		setFilterList(filter);
	};

	return (
		<>
			<div class="container container-fluid full-height">
				<div class="row pb-3">
					<div class="col">
						<h3 class="align-bottom">{title}</h3>
					</div>
					{visibleFilters && (
						<div class="col col-sm-1 d-flex justify-content-end">
							<button
								class="btn btn-light"
								type="button"
								title="Filters"
								onClick={handleShow}
							>
								<IconFilter stroke={1.25} />
							</button>
						</div>
					)}
				</div>
				<div class="row">
					<div class="col table-container">
						<DtGrid
							data={data}
							columns={columnList}
							height={height}
							filters={filterList}
							layout={layout}
						/>
					</div>
				</div>
			</div>
			<Modal show={show} onHide={handleClose} dialogClassName="modal-lg">
				<Modal.Header closeButton>
					<Modal.Title>Data filters</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div class="py-2">
						<DtGridFilter
							columnConfig={columnConfig}
							initialFilters={filterList}
							onChange={handleFilterChange}
						/>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
