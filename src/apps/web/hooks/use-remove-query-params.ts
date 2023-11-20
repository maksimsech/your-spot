import { useMemo } from 'react'


// TODO: Revisit
export function useRemoveQueryParams() {
    return useMemo(() => ({
        removeQueryParams: function removeQueryParams(...params: string[]) {
            const url = new URL(document.URL)
            for (const param of params) {
                url.searchParams.delete(param)
            }
            history.replaceState(null, '', url.href)
        },
    }), [])
}
