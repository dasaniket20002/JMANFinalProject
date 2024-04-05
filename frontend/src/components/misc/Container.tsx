import { twMerge } from "tailwind-merge";
import { Container_type } from "../../ts/Types";

const Container = ({
  containerHeading,
  headerType,
  children,
  className,
  bulged,
}: Container_type) => {
  return (
    <div
      className={twMerge(
        headerType !== "l3" && "px-6 md:ml-72 md:px-16 2xl:px-64 flex flex-col",
        className
      )}
    >
      <header
        className={twMerge(
          "w-full",
          headerType === "l1" && "py-6 font-semibold text-3xl",
          headerType === "l2" && "py-6 font-medium text-3xl",
          headerType === "l3" && "py-0 font-normal text-2xl"
        )}
      >
        {containerHeading}
      </header>
      {children && (
        <section
          className={twMerge(
            "flex flex-col gap-8 pt-8",
            headerType === "l1" && "py-16",
            headerType === "l2" && "py-8",
            headerType === "l3" && "pb-8",
            bulged && "-mx-2"
          )}
        >
          {children}
        </section>
      )}
    </div>
  );
};

export default Container;
