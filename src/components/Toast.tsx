interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div className={`toast ${message ? 'toast-visible' : ''}`}>
      {message}
    </div>
  );
}
