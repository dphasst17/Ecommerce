import { Button, Checkbox, cn, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react"
import { ProductFilterType } from "types/type"

interface FilBrand {
  listBrand: string[],
  setFilter: React.Dispatch<React.SetStateAction<ProductFilterType | any>>
  filterData: ProductFilterType
}

const FilterBrand = ({ listBrand, setFilter, filterData }: FilBrand) => {
  const setFilterBrand = (value: string) => {
    const getValue = filterData.brand.filter((f: string) => f === value)
    const handleBrand = getValue.length !== 0 ? filterData.brand.filter((f: string) => f !== value) : [...filterData.brand, value]

    const newFilterData = { ...filterData };

    newFilterData.brand = handleBrand;

    setFilter(newFilterData);
  }
  return <Popover showArrow placement="bottom">
    <PopoverTrigger>
      <Button
        variant="bordered"
        size="sm"
        radius="sm"
        color="default"
        className="mx-1"
      >
        BRAND
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-full p-1 flex items-start justify-around">
      <div className="px-1 py-2 w-full">
        <div className="mt-2 flex flex-col gap-2 w-full">
          {listBrand.map((b: string) =>
            <Checkbox
              defaultSelected={filterData.brand.includes(b)}
              onClick={() => { setFilterBrand(b) }}
              classNames={{ base: cn("inline-flex w-full max-w-md bg-content1",), label: ["w-full"] }}
              key={`checkbox-brand-${b}`}
            >
              {b.toLocaleUpperCase()}
            </Checkbox>)}
        </div>
      </div>
    </PopoverContent>
  </Popover>
}

export default FilterBrand