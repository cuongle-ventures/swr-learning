import { useEffect, useState } from 'react';

const useDebounce = (val: string, ms: number = 300, cb?: () => void) => {
    const [internalVal, setInternal] = useState(val);

    useEffect(() => {
        const t = setTimeout(() => {
            setInternal(val);
            cb?.();
        }, ms);

        return () => {
            if (t) {
                clearTimeout(t);
            }
        };
    }, [internalVal, val, ms, cb]);
};

export default useDebounce;
