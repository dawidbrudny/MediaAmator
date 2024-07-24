import { 
    type ComponentPropsWithoutRef,
    type FormEvent,
    forwardRef,
    useRef,
    useImperativeHandle
} 
from 'react';

export type FormHandle = {
    clear: () => void;
}

type FormProps = {
    onSave: (value: unknown) => void;
} & ComponentPropsWithoutRef<'form'>;

const Form = forwardRef<FormHandle, FormProps>(({ onSave, children, ...props }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);

    useImperativeHandle(ref, () => ({
        clear: () => formRef.current?.reset()
    }));

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);
        onSave(data);
    }

    return (
        <form ref={formRef} {...props} onSubmit={handleSubmit}>
            {children}
        </form>
    );
});

export default Form;
