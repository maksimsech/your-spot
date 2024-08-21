// Inspired by react-hot-toast library
import {
    type ReactNode,
    useState,
    useEffect,
} from 'react'

import type {
    ToastActionElement,
    ToastProps,
} from './toast'


const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: ReactNode
  description?: ReactNode
  action?: ToastActionElement
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actionTypes = {
    addToast: 'addToast',
    updateToast: 'updateToast',
    dismissToast: 'dismissToast',
    removeToast: 'removeToast',
} as const

let count = 0

function genId() {
    count = (count + 1) % Number.MAX_VALUE
    return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType['addToast']
      toast: ToasterToast
    }
  | {
      type: ActionType['updateToast']
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType['dismissToast']
      toastId?: ToasterToast['id']
    }
  | {
      type: ActionType['removeToast']
      toastId?: ToasterToast['id']
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
    if (toastTimeouts.has(toastId)) {
        return
    }

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId)
        dispatch({
            type: 'removeToast',
            toastId: toastId,
        })
    }, TOAST_REMOVE_DELAY)

    toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
    case 'addToast':
        return {
            ...state,
            toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
        }

    case 'updateToast':
        return {
            ...state,
            toasts: state.toasts.map((t) =>
                t.id === action.toast.id ? { ...t, ...action.toast } : t,
            ),
        }

    case 'dismissToast': {
        const { toastId } = action

        // ! Side effects ! - This could be extracted into a dismissToast() action,
        // but I'll keep it here for simplicity
        if (toastId) {
            addToRemoveQueue(toastId)
        } else {
            state.toasts.forEach((toast) => {
                addToRemoveQueue(toast.id)
            })
        }

        return {
            ...state,
            toasts: state.toasts.map((t) =>
                t.id === toastId || toastId === undefined
                    ? {
                        ...t,
                        open: false,
                    }
                    : t,
            ),
        }
    }
    case 'removeToast':
        if (action.toastId === undefined) {
            return {
                ...state,
                toasts: [],
            }
        }
        return {
            ...state,
            toasts: state.toasts.filter((t) => t.id !== action.toastId),
        }
    }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
    memoryState = reducer(memoryState, action)
    listeners.forEach((listener) => {
        listener(memoryState)
    })
}

type Toast = Omit<ToasterToast, 'id'>

function toast({ ...props }: Toast) {
    const id = genId()

    const update = (props: ToasterToast) =>
        dispatch({
            type: 'updateToast',
            toast: { ...props, id },
        })
    const dismiss = () => dispatch({ type: 'dismissToast', toastId: id })

    dispatch({
        type: 'addToast',
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open) => {
                if (!open) dismiss()
            },
        },
    })

    return {
        id: id,
        dismiss,
        update,
    }
}

function useToast() {
    const [state, setState] = useState<State>(memoryState)

    useEffect(() => {
        listeners.push(setState)
        return () => {
            const index = listeners.indexOf(setState)
            if (index > -1) {
                listeners.splice(index, 1)
            }
        }
    }, [state])

    return {
        ...state,
        toast,
        dismiss: (toastId?: string) => dispatch({ type: 'dismissToast', toastId }),
    }
}

export {
    useToast,
    toast,
    type Toast,
}
