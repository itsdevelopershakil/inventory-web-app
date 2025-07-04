import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { FiSearch, FiTrash } from "react-icons/fi";
import { MdOutlineModeEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router";
import SupplierDetailsModal from "../../components/detailsModal";
import Pagination from "../../components/Pagination";
import {
    useDeleteSupplierMutation,
    useGetSupplierQuery,
} from "../../redux/features/suppliers/supplierApi";
import { type ISupplier } from "../../redux/features/suppliers/supplierSlice";

export interface IMetaInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const SuppliersPage = () => {
    const [page, setPage] = useState(1);
    const [showLimit, setShowLimit] = useState(20);
    const [search, setSearch] = useState("");

    const {
        data: response,
        isLoading: getSupplierLoading,
        isFetching,
    } = useGetSupplierQuery(
        {
            page,
            limit: showLimit,
            search,
        },
        {
            skip: !page,
        }
    );

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteSupplier, { isLoading }] = useDeleteSupplierMutation();

    const { data: supplier, meta } = response || {};

    const [supplierDetails, setSupplierDetails] = useState<ISupplier | null>(
        null
    );
    const [toggleSupplierDetails, setToggleSupplierDetails] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const [showSearchedFor, setShowSearchedFor] = useState(
        search ? true : false
    );
    const [showclose, setShowClose] = useState(false);

    useEffect(() => {
        if (searchValue) {
            setShowClose(true);
        } else {
            setShowClose(false);
        }
    }, [setShowClose, searchValue]);

    const handleSearchButton = async () => {
        setPage(1);
        setSearch(searchValue);
        setShowSearchedFor(true);
    };

    const handleClearButton = async () => {
        setSearch("");
        setSearchValue("");
        setShowSearchedFor(false);
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            const res = await deleteSupplier(id);
            if (res.data?.success) {
                toast.success(res.data.message);
            }
            setDeletingId(null);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message);
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="bg-white dark:bg-stone-700 rounded-md p-2 sm:p-4 sm:px-6">
                <h1 className="font-medium text-lg mb-4 dark:text-gray-300">
                    Suppliers
                </h1>
                <div className="flex justify-between flex-wrap sm:flex-nowrap gap-2 dark:text-gray-300">
                    <div className="flex justify-between flex-wrap sm:flex-nowrap gap-2">
                        {showSearchedFor ? (
                            <div className="flex items-center gap-4 mb-1.5">
                                <h2 className="text-base font-medium">
                                    Search for &quot;{search}&quot;
                                </h2>
                                <button
                                    type="button"
                                    onClick={handleClearButton}
                                    className="bg-gray-600 text-white  px-4 py-1.5 rounded-full font-medium text-sm cursor-pointer"
                                >
                                    {isFetching ? "Searching..." : "Clear"}
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center border border-gray-300 dark:border-gray-500 rounded-lg pl-3 w-[300px] gap-1">
                                <FiSearch className="text-lg shrink-0 text-gray-500" />
                                <input
                                    type="text"
                                    name="search"
                                    id="search"
                                    value={searchValue}
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
                                    placeholder="Search Supplier"
                                    className="placeholder:text-sm size-full outline-none"
                                />
                                <button
                                    onClick={() => setSearchValue("")}
                                    className={`bg-gray-200 cursor-pointer hover:bg-gray-300 dark:text-stone-600 duration-300  rounded-full p-1 ${
                                        showclose ? "block" : "hidden"
                                    }`}
                                >
                                    <RxCross2 className="text-sm " />
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSearchButton}
                                    disabled={!searchValue}
                                    className="bg-blue-500 hover:bg-blue-600 duration-300 cursor-pointer text-white py-2 px-3 rounded-r-lg text-sm"
                                >
                                    Search
                                </button>
                            </div>
                        )}
                    </div>

                    <Link
                        to={"new-supplier"}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center text-xs gap-1 cursor-pointer hover:bg-blue-600 duration-200"
                    >
                        <FaPlus className="text-lg" /> <span>New Supplier</span>
                    </Link>
                </div>

                <div className="mt-10 overflow-x-auto text-nowrap">
                    <table className="w-full border-collapse rounded-md text-gray-700 dark:text-gray-300">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-stone-600 text-left *:font-semibold text-sm">
                                <th className="p-3">ID</th>
                                <th className="p-3">Company Name</th>
                                <th className="p-3">Full Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Phone Number</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getSupplierLoading || isFetching ? (
                                <tr>
                                    <td
                                        className="p-3 text-center text-gray-500 dark:text-gray-300"
                                        colSpan={6}
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : supplier?.length > 0 ? (
                                supplier.map(
                                    (value: ISupplier, idx: number) => (
                                        <tr
                                            onClick={() => {
                                                setSupplierDetails(value);
                                                setToggleSupplierDetails(true);
                                            }}
                                            key={idx}
                                            className="border-b border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-stone-500 text-sm cursor-pointer"
                                        >
                                            <td className="p-3">{idx + 1}</td>
                                            <td className="p-3">
                                                {value.companyName}
                                            </td>
                                            <td className="p-3">
                                                {value.fullName}
                                            </td>
                                            <td className="p-3">
                                                {value.email}
                                            </td>
                                            <td className="p-3">
                                                {value.phone}
                                            </td>
                                            <td className="flex items-center gap-1 p-3">
                                                <Link
                                                    to={`edit-supplier`}
                                                    state={{
                                                        ...value,
                                                    }}
                                                    className="flex gap-0.5 items-center py-1.5 px-3 bg-blue-500 text-white rounded-sm text-xs cursor-pointer shrink-0"
                                                >
                                                    <MdOutlineModeEdit className="" />{" "}
                                                    <span>Edit</span>
                                                </Link>
                                                <button
                                                    className="bg-red-400 text-white p-1.5 rounded-sm cursor-pointer shrink-0"
                                                    onClick={() =>
                                                        handleDelete(value.id)
                                                    }
                                                >
                                                    {isLoading &&
                                                    value.id === deletingId ? (
                                                        <AiOutlineLoading3Quarters className="text-md animate-spin duration-300" />
                                                    ) : (
                                                        <FiTrash className="text-md" />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : (
                                <tr className="border-b border-gray-300 dark:border-gray-300 text-sm">
                                    <td
                                        colSpan={6}
                                        className="p-3 text-center text-gray-500 dark:text-gray-300"
                                    >
                                        No Suppliers found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {!isLoading && (meta as IMetaInfo)?.totalPages > 1 && (
                        <section className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                Total Expenses : {(meta as IMetaInfo)?.total}
                            </p>
                            <Pagination
                                currentPage={(meta as IMetaInfo)?.page || page}
                                totalPages={(meta as IMetaInfo)?.totalPages}
                                onPageChange={setPage}
                            />
                            <div className="flex items-center gap-2 dark:text-gray-300">
                                <p className="text-sm">Show per page :</p>
                                <select
                                    onChange={(e) =>
                                        setShowLimit(Number(e.target.value))
                                    }
                                    name="pageLimit"
                                    id="pageLimit"
                                    value={showLimit}
                                    className="px-2 py-1 outline-none border border-gray-300 dark:border-gray-500 dark:bg-stone-500 dark:text-gray-300 rounded-md"
                                >
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                        </section>
                    )}
                </div>
            </div>
            {toggleSupplierDetails && supplierDetails && (
                <SupplierDetailsModal
                    Supplier={supplierDetails}
                    toggleSupplierDetails={setToggleSupplierDetails} // pass setter function
                    title={"Supplier Information"}
                />
            )}
        </div>
    );
};

export default SuppliersPage;
