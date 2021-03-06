import React, { useState, useMemo, useRef } from 'react'
import ReactTable from 'react-table'
import { fetchEntries } from '../../api'
import { Link } from 'react-router-dom'

import 'react-table/react-table.css'
import '../../styles/BillEntry.css'
import EntriesMap from './EntriesMap'

const serialCodeColumn = {
  Header: 'Serial Code',
  accessor: 'serialCode',
  Cell: ({ value }) => (
    <Link
      to={{ pathname: `/explore/${value}`, state: 'reload' }}
      className="entry-serial-code"
    >
      {value}
    </Link>
  )
}

const getColumns = (serialCode) => [...(!serialCode ? [serialCodeColumn] : []), {
  Header: 'Date',
  accessor: 'currentDate',
  Cell: ({ value }) => <span className="entry-date">{value}</span>
}, {
  id: 'location',
  Header: 'Location',
  accessor: d => [d.latitude, d.longitude],
  Cell: ({ value: [latitude, longitude] }) => (
    <div className="entry-location">
      <span><b style={{ fontWeight: 'bold' }}>lat:</b> {latitude}</span>
      <br></br><br></br>
      <span><b style={{ fontWeight: 'bold' }}>lng:</b> {longitude}</span>
    </div>
  ),
}, {
  Header: 'Notes',
  accessor: 'notes',
  Cell: ({ value }) => (
    <textarea className="entry-notes" defaultValue={value} disabled />
  )
}]

const defaultPageSize = 5

const BillEntries = ({ match, location }) => {
  const { serialCode } = match.params
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const columns = useMemo(
    () => getColumns(serialCode),
    [serialCode],
  )
  const table = useRef(null)

  useMemo(
    () => {
      if (table.current && location.state === 'reload') {
        table.current.fireFetchData()
      }
    },
    [serialCode]
  )

  return (
    <>
      {serialCode && <h1 className="serialCode">Code: {serialCode}</h1>}
      <EntriesMap entries={data} />
      <ReactTable
        ref={table}
        columns={columns}
        data={data}
        page={page}
        defaultPageSize={defaultPageSize}
        pageSizeOptions={[5, 10, 15, 20]}
        loading={loading}
        noDataText="No bill entries found"
        sortable={false}
        onPageChange={pageIndex => setPage(pageIndex)}
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
        pageSize={pageSize}
        minRows={0}
        onFetchData={(state, instance) => {
          setLoading(true)
          fetchEntries(serialCode)
            .then((rows) => {
              setLoading(false)
              setData(rows)
            })
        }}
      />
    </>
  )
}

export default BillEntries
