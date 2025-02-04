import { FieldErrors, FieldValues, Path, RegisterOptions, UseFormRegister } from "react-hook-form";
import { MdErrorOutline } from "react-icons/md";

export default function TextInput<T extends FieldValues> ({ name, labelText, placeholder, errors, register, options }: {
    name: Path<T>;
    labelText: string;
    placeholder: string;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>,
    options?: RegisterOptions<T, Path<T>>
}) {
    return (
        <div className="mt-[1.5rem]">
            <label
                htmlFor={String(name)}
                className="block mb-1 font-bold"
            >
                {labelText}
            </label>
            <input
                type="text"
                id={String(name)}
                placeholder={placeholder}
                className="mt-3 w-full p-2 border rounded-lg transition-all duration-150 hover:ring-2 hover:ring-brand-700 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                {...register(name, options)}
            />
            <p className="text-red-500 flex gap-1 items-center font-bold mb-4 mt-2">
                {errors[name]?.message && <MdErrorOutline />}
                {errors[name]?.message as string}
            </p>
        </div>
    )
}