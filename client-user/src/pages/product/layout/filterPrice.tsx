import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react"
import { ProductFilterType } from "types/type"
interface FilPrice {
  setFilter: React.Dispatch<React.SetStateAction<ProductFilterType | any>>
  filterData: ProductFilterType
}

const FilterPrice = ({ setFilter, filterData }: FilPrice) => {
  const setFilPrice = (value: string) => {
    const newFilterData = { ...filterData };
    newFilterData.price = value;
    setFilter(newFilterData);
  }
  return <Dropdown>
    <DropdownTrigger>
      <Button
        variant="bordered"
        radius='sm'
        size='sm'
        color='default'
        className="mx-1"
      >
        PRICE
      </Button>
    </DropdownTrigger>
    <DropdownMenu aria-label="Static Actions">
      <DropdownItem onClick={() => { setFilPrice('lth') }} className={`${filterData.price === "lth" ? 'bg-blue-600 text-white' : 'text-zinc-900'}`}>
        Low to High
      </DropdownItem>
      <DropdownItem onClick={() => { setFilPrice('htl') }} className={`${filterData.price === "htl" ? 'bg-blue-600 text-white' : 'text-zinc-900'}`}>
        High to Low
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
}

export default FilterPrice