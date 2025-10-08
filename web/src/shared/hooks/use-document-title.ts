import { useRef } from 'react'
import { useIsomorphicLayoutEffect, useUnmount } from 'usehooks-ts'

interface UseDocumentTitleOptions {
    preserveTitleOnUnmount?: boolean
}

export function useDocumentTitle(
    title: string,
    options: UseDocumentTitleOptions = {},
): void {
    const { preserveTitleOnUnmount = true } = options
    const defaultTitle = useRef<string | null>(null)

    useIsomorphicLayoutEffect(() => {
        defaultTitle.current = window.document.title
    }, [])

    useIsomorphicLayoutEffect(() => {
        window.document.title = title
    }, [title])

    useUnmount(() => {
        if (!preserveTitleOnUnmount && (defaultTitle.current != null)) {
            window.document.title = defaultTitle.current
        }
    })
}