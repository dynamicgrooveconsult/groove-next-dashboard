import Link from 'next/link';

export default function WhatsAppFloat() {
  return (
    <Link
      href="https://wa.me/2348086148671"
      target="_blank"
      className="fixed bottom-6 right-6 bg-green-500 p-4 rounded-full shadow-lg z-[9999] hover:bg-green-600 transition-all"
    >
      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.031 6.172c-3.18 0-5.767 2.587-5.767 5.767 0 1.018.267 1.996.776 2.856L6.5 17.5l2.946-.776c.86.509 1.838.776 2.856.776 3.18 0 5.767-2.587 5.767-5.767 0-3.18-2.587-5.767-5.767-5.767zM12.031 16.5c-.889 0-1.748-.235-2.502-.676l-.178-.105-1.84.484.49-1.794-.114-.188c-.441-.727-.674-1.565-.674-2.437 0-2.613 2.127-4.74 4.74-4.74 2.613 0 4.74 2.127 4.74 4.74 0 2.613-2.127 4.74-4.74 4.74z" />
      </svg>
    </Link>
  );
}
