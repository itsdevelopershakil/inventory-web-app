import { zodResolver } from "@hookform/resolvers/zod";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useGetCategoriesQuery } from "../../redux/features/categories/categoriesApiSlice";
import type { ICategory } from "../../redux/features/categories/categoriesSlice";
import { useCreateItemMutation } from "../../redux/features/items/itemApiSlice";
import {
    changeFormValues,
    resetItemForm,
} from "../../redux/features/items/itemFormSlice";
import type { RootState } from "../../redux/store";
import { getErrorMessage } from "../../utils/errorHandler";
import AddVariantForm from "./AddVariantForm";
import { fullItemFormSchema, type ItemFormInput } from "./zodSchemaItem";

const CreateItemPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [createItem, { isLoading }] = useCreateItemMutation();
    const { data: categories } = useGetCategoriesQuery(null);
    const { attributes, variations } = useSelector(
        (state: RootState) => state.itemForm
    );

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<ItemFormInput>({
        resolver: zodResolver(fullItemFormSchema),
        defaultValues: {
            name: "",
            costPrice: "",
            sellPrice: "",
            discountPercentage: "",
            description: "",
            categoryId: "",
            brand: "",
            stock: "",
            isVariantChecked: false,
        },
    });

    const isVariantChecked = watch("isVariantChecked");

    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target;

        if (e.target instanceof HTMLInputElement && type === "checkbox") {
            dispatch(changeFormValues({ [name]: e.target.checked }));
        } else {
            dispatch(changeFormValues({ [name]: value }));
        }
    };

    const onSubmit = async (data: ItemFormInput) => {
        const { stock, sellPrice, costPrice, discountPercentage, ...formData } =
            data;
        let finalData = JSON.parse(JSON.stringify({ ...formData }));

        if (!isVariantChecked && stock) {
            finalData = {
                ...finalData,
                stock: parseInt(stock),
                sellPrice: parseFloat(sellPrice) || 0,
                costPrice: parseFloat(costPrice) || 0,
                discountPercentage:
                    (discountPercentage && parseFloat(discountPercentage)) || 0,
            };
            try {
                await createItem(finalData).unwrap();
                toast.success("Item Created Successfully");
                navigate("/items");
                // reset form
                const resetForm = {
                    form: {
                        name: "",
                        costPrice: "",
                        sellPrice: "",
                        discountPercentage: "",
                        description: "",
                        categoryId: "",
                        brand: "",
                        stock: "",
                        isVariantChecked: false,
                    },
                    attributes: [],
                    variations: [],
                };
                dispatch(resetItemForm(resetForm));
                reset();
            } catch (error) {
                toast.error(getErrorMessage(error));
            }
        }

        if (isVariantChecked && variations.length <= 0) {
            toast.error("Item variation is required.");
        }

        if (isVariantChecked && variations.length > 0) {
            const finalVariations = variations.map((v) => ({
                ...v,
                stock: parseInt(v.stock) || 0,
                sellPrice: parseFloat(finalData.sellPrice) || 0,
                costPrice: parseFloat(finalData.costPrice) || 0,
                attributes: Object.fromEntries(
                    v.attributes.map((item) => {
                        const [key, value] = item.split(":");
                        return [key, value];
                    })
                ),
            }));
            finalData = {
                ...finalData,
                sellPrice: parseFloat(sellPrice) || 0,
                costPrice: parseFloat(costPrice) || 0,
                attributes,
                variant: finalVariations,
            };
            try {
                await createItem(finalData).unwrap();
                toast.success("Item Created Successfully");
                navigate("/items");
                // reset form
                const resetForm = {
                    form: {
                        name: "",
                        costPrice: "",
                        sellPrice: "",
                        discountPercentage: "",
                        description: "",
                        categoryId: "",
                        brand: "",
                        stock: "",
                        isVariantChecked: false,
                    },
                    attributes: [],
                    variations: [],
                };
                reset();
                dispatch(resetItemForm(resetForm));
            } catch (error) {
                toast.error(getErrorMessage(error));
            }
        } else {
            finalData = {
                ...finalData,
                stock: (stock && parseInt(stock)) || 0,
            };
        }
    };

    return (
        <div className="bg-white dark:bg-stone-700 p-4 sm:p-6 rounded-lg">
            <h3 className="text-2xl font-semibold dark:text-gray-300">
                Item Information
            </h3>
            <form
                className="mt-5 space-y-4 *:flex *:flex-col *:gap-2 dark:text-gray-300"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div>
                    <label htmlFor="name">
                        Name <span className="text-red-600">*</span>
                    </label>
                    <input
                        {...register("name")}
                        type="text"
                        name="name"
                        id="name"
                        className="border border-gray-300 dark:border-gray-500 w-full p-2 outline-none rounded-md"
                    />
                    {errors.name && (
                        <span className="text-red-500 text-xs">
                            {errors.name.message}
                        </span>
                    )}
                </div>
                <div>
                    <label htmlFor="costPrice">
                        Cost Price <span className="text-red-600">*</span>
                    </label>
                    <input
                        {...register("costPrice")}
                        type="number"
                        name="costPrice"
                        id="costPrice"
                        step="any"
                        className="border border-gray-300 dark:border-gray-500 w-full p-2 outline-none rounded-md"
                    />
                    {errors.costPrice && (
                        <span className="text-red-500 text-xs">
                            {errors.costPrice.message}
                        </span>
                    )}
                </div>
                <div>
                    <label htmlFor="sellPrice">
                        Sell Price <span className="text-red-600">*</span>
                    </label>
                    <input
                        {...register("sellPrice")}
                        type="number"
                        name="sellPrice"
                        id="sellPrice"
                        step="any"
                        className="border border-gray-300 dark:border-gray-500 w-full p-2 outline-none rounded-md"
                    />
                    {errors.sellPrice && (
                        <span className="text-red-500 text-xs">
                            {errors.sellPrice.message}
                        </span>
                    )}
                </div>
                <div>
                    <label htmlFor="discountPercentage">Discount (%)</label>
                    <input
                        {...register("discountPercentage")}
                        type="number"
                        name="discountPercentage"
                        id="discountPercentage"
                        step="any"
                        className="border border-gray-300 dark:border-gray-500 w-full p-2 outline-none rounded-md"
                    />
                    {errors.discountPercentage && (
                        <span className="text-red-500 text-xs">
                            {errors.discountPercentage.message}
                        </span>
                    )}
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        {...register("description")}
                        name="description"
                        id="description"
                        className="border border-gray-300 dark:border-gray-500 w-full p-2 outline-none rounded-md overflow-hidden resize-none min-h-[100px]"
                    ></textarea>
                    {errors.description && (
                        <span className="text-red-500 text-xs">
                            {errors.description.message}
                        </span>
                    )}
                </div>
                <div>
                    <label htmlFor="categoryId">Category</label>
                    <select
                        id="categoryId"
                        {...register("categoryId")}
                        className="border border-gray-300 dark:border-gray-500 dark:bg-stone-600 w-full p-2 outline-none rounded-md"
                    >
                        <option value="">Select Category</option>
                        {categories?.map((category: ICategory) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.categoryId && (
                        <span className="text-red-500 text-xs">
                            {errors.categoryId.message}
                        </span>
                    )}
                </div>
                <div>
                    <label htmlFor="brand">Brand</label>
                    <input
                        {...register("brand")}
                        type="text"
                        name="brand"
                        onChange={handleChange}
                        className="border border-gray-300 dark:border-gray-500 w-full p-2 outline-none rounded-md"
                    />
                    {errors.brand && (
                        <span className="text-red-500 text-xs">
                            {errors.brand.message}
                        </span>
                    )}
                </div>
                {!isVariantChecked && (
                    <div>
                        <label htmlFor="stock">
                            Stock <span className="text-red-600">*</span>
                        </label>
                        <input
                            {...register("stock")}
                            type="number"
                            name="stock"
                            id="stock"
                            required={!isVariantChecked}
                            className="border border-gray-300 dark:border-gray-500 w-full p-2 outline-none rounded-md"
                        />
                    </div>
                )}
                <div>
                    <div className="flex items-center gap-1">
                        <input
                            {...register("isVariantChecked")}
                            type="checkbox"
                            name="isVariantChecked"
                            id="isVariantChecked"
                        />
                        <label
                            htmlFor="isVariantChecked"
                            className="w-full cursor-pointer select-none"
                        >
                            Add Variations
                        </label>
                    </div>
                </div>
                {isVariantChecked && <AddVariantForm />}
                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer ml-auto bg-blue-500 text-white py-2 px-4 rounded-md disabled:bg-blue-500/50"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateItemPage;
