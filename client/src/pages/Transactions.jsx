import React, { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import TransactionItem from "../components/TransactionItem";
import TransactionDetails from "../components/TransactionDetails";
import EditTransaction from "../components/EditTransaction";
import DeleteConfirm from "../components/DeleteConfirm";
import AddTransactionModal from "../components/transactions/AddTransactionModal";
import BackButton from "../components/BackButton";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [selected, setSelected] = useState(null);
  const [editTx, setEditTx] = useState(null);
  const [deleteTx, setDeleteTx] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchTransactions = async (q = query) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (q) params.append("search", q);
      const res = await api.get(`/transactions?${params.toString()}`);
      setTransactions(res.data);
    } catch {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions(query);
  };

  const handleRefresh = () => {
    fetchTransactions();
  };

  const handleUpdateLocal = (updated) => {
    setTransactions((prev) =>
      prev.map((t) => (t._id === updated._id ? updated : t))
    );
    setEditTx(null);
    toast.success("Transaction updated");
  };

  const handleDeleteLocal = (deletedId) => {
    setTransactions((prev) => prev.filter((t) => t._id !== deletedId));
    setDeleteTx(null);
    toast.success("Transaction deleted");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto relative">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-emerald-500 font-semibold">History</div>
          <h1 className="text-2xl font-semibold mt-1">Transactions</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdd(true)}
            className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm"
          >
            Add Transaction
          </button>
          <button
            onClick={handleRefresh}
            className="bg-slate-100 px-3 py-2 rounded-lg text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mt-4 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, category, amount..."
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
        />
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm">
          Search
        </button>
      </form>

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-12 gap-4 items-center p-4 border-b border-slate-100 text-xs font-medium text-slate-500">
          <div className="col-span-4">Title</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-1">Date</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div>
          {loading ? (
            <div className="p-6 text-center text-sm">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No transactions found
            </div>
          ) : (
            transactions.map((tx) => (
              <TransactionItem
                key={tx._id}
                tx={tx}
                onView={() => setSelected(tx)}
                onEdit={() => setEditTx(tx)}
                onDelete={() => setDeleteTx(tx)}
              />
            ))
          )}
        </div>

        <div className="p-4 flex justify-between items-center text-xs text-slate-500">
          <div>Showing {transactions.length} results</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 bg-slate-100 rounded"
            >
              Prev
            </button>
            <div className="px-3 py-1.5">{page}</div>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 bg-slate-100 rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <TransactionDetails
        open={!!selected}
        tx={selected}
        onClose={() => setSelected(null)}
      />
      <EditTransaction
        open={!!editTx}
        tx={editTx}
        onClose={() => setEditTx(null)}
        onUpdated={handleUpdateLocal}
      />
      <DeleteConfirm
        open={!!deleteTx}
        tx={deleteTx}
        onClose={() => setDeleteTx(null)}
        onDeleted={handleDeleteLocal}
      />
      <AddTransactionModal
        open={showAdd}
        onClose={() => {
          setShowAdd(false);
          fetchTransactions();
        }}
      />
      <BackButton />
    </div>
  );
}
