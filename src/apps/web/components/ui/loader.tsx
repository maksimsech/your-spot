import { SymbolIcon } from '@radix-ui/react-icons'


export function Loader() {
    return (
        <div className='flex gap-2'>
            <SymbolIcon className='size-6 animate-spin' />
            <span className='font-bold'>Loading</span>
        </div>
    )
}
