import { 
    type ComponentPropsWithRef,
    forwardRef
} 
from 'react';

type InputProps = {
    label: string;
    id: string;
} & ComponentPropsWithRef<'input'>;

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, id, ...props }, ref) => {
    return (
        <>
            <label htmlFor={id}>{label}</label>
            <input id={id} name={id} {...props} ref={ref} />
        </>
    );
});


export default Input;