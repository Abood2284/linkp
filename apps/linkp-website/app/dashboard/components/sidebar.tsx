import Link from "next/link";
import {
  Home,
  LinkIcon,
  ShoppingCart,
  Package,
  PlaySquare,
  Settings,
  BookOpen,
  Calendar,
  Box,
  HeadphonesIcon,
  HelpCircle,
} from "lucide-react";

export function Sidebar() {
  return (
    <div className="w-64 border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="text-purple-600 text-2xl">⚡</div>
          Lynku.id
        </Link>
      </div>

      <div className="px-4 py-4">
        <div className="text-sm text-gray-500 mb-4">Main Menu</div>
        <nav className="space-y-1">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
          >
            <Home className="h-5 w-5" />
            Home
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg bg-purple-50 px-3 py-2 text-purple-600"
          >
            <LinkIcon className="h-5 w-5" />
            My Bio Link
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
          >
            <ShoppingCart className="h-5 w-5" />
            Orders
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
          >
            <Package className="h-5 w-5" />
            My Purchase
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
          >
            <PlaySquare className="h-5 w-5" />
            Tutorials
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
          >
            <Settings className="h-5 w-5" />
            Setting
          </Link>
        </nav>

        <div className="mt-8">
          <div className="text-sm text-gray-500 mb-4">Products</div>
          <nav className="space-y-1">
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <Calendar className="h-5 w-5" />
              Appointment
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <PlaySquare className="h-5 w-5" />
              Course Video
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <BookOpen className="h-5 w-5" />
              Digital Content
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <Box className="h-5 w-5" />
              Digital Product
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <Calendar className="h-5 w-5" />
              Event
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <Package className="h-5 w-5" />
              Physical Product
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <HeadphonesIcon className="h-5 w-5" />
              Support
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
