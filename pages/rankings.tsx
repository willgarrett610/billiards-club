import { Header } from '@/components/header/header';
import { Ranking, useGetRankings } from '@/services/playerService';
import { useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef, //if using TypeScript (optional, but recommended)
} from 'material-react-table';

const Rankings = () => {
    const { data: rankings } = useGetRankings();

    const columns = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Elo',
                accessorKey: 'elo',
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: rankings ? rankings : [],
        enableRowSelection: true,
        enableColumnOrdering: true,
        enableGlobalFilter: false,
    });

    return (
        <>
            <Header />
            <div className="content">
                <div className="pageTitle">Player Rankings</div>
                <MaterialReactTable table={table} />
            </div>
        </>
    );
};

export default Rankings;
