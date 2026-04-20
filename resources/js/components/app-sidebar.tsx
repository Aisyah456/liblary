"use client"

import { Link, usePage } from "@inertiajs/react"
import {
  BookOpen,
  LayoutGrid,
  ShieldCheck,
  LibraryBig,
  LifeBuoy,
  Send,
  Users,
  UserCheck,
  Book,
  FileJson,
  ArrowRightLeft,
  Settings2,
  LayoutDashboard,
  Newspaper,
  Repeat,
  FileText,
  Mail,
  Building2,
  Image as ImageIcon,
  FolderTree,
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { dashboard } from "@/routes"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { url } = usePage()
  const { props: pageProps } = usePage()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (pageProps as any)?.auth?.user || (pageProps as any)?.user || null
  const { setOpen } = useSidebar()

  const navigationData = [
    {
      id: "dashboard",
      title: "Panel Utama",
      icon: LayoutGrid,
      menus: [
        {
          title: "Dashboard",
          url: dashboard().url,
          icon: LayoutDashboard,
          isActive: true,
        },
      ],
    },
    {
      id: "cms",
      title: "Content Management",
      icon: ShieldCheck,
      menus: [
        {
          title: "Landing Page",
          url: "#",
          icon: ImageIcon,
          items: [
            { title: "Banner / Slider", url: '/admin/hero' },
            { title: "Profil Perpustakaan", url: '/admin/profile' },
            { title: "Fasilitas & Layanan", url: '/admin/services' },
            { title: "Testimoni Pustaka", url: '/admin/feedback' },
            { title: "FAQ", url: '/admin/messages' },
          ],
        },
        {
          title: "Organisasi",
          url: "#",
          icon: Building2,
          items: [
            // Gunakan rute /admin/staff untuk mengelola database library_staff
            { title: "Struktur Organisasi", url: '/admin/staff' },
            { title: "Partner / Mitra", url: '/admin/partners' },
          ],
        },
        {
          title: "Publikasi",
          url: "#",
          icon: Newspaper,
          items: [
            { title: "Berita Utama", url: '/admin/news' },
            { title: "Artikel & Blog", url: '/admin/articles' },
            { title: "Pengumuman", url: '/admin/announcements' },
          ],
        }, // PERBAIKAN: Karakter '#' yang salah telah dihapus dari sini
      ],
    },
    {
      id: "catalog",
      title: "Manajemen Katalog",
      icon: BookOpen,
      menus: [
        {
          title: "Katalog Buku",
          url: "#",
          icon: Book,
          items: [
            { title: "Semua Koleksi", url: '#' },
            { title: "Buku Fisik", url: '#' },
            { title: "E-Book (Digital)", url: '#' },
            { title: "Kategori & Rak", url: '#' },
          ],
        },
        {
          title: "Metadata",
          url: "#",
          icon: FolderTree,
          items: [
            { title: "Penulis", url: '#' },
            { title: "Penerbit", url: '#' },
            { title: "Tahun Terbit", url: '#' },
          ],
        },
        {
          title: "Karya Ilmiah",
          url: '#',
          icon: FileJson,
        },
      ],
    },
    {
      id: "circulation",
      title: "Layanan & Sirkulasi",
      icon: Repeat,
      menus: [
        {
          title: "Transaksi",
          url: "#",
          icon: ArrowRightLeft,
          items: [
            { title: "Peminjaman Baru", url: '#' },
            { title: "Pengembalian", url: '#' },
            { title: "Riwayat Transaksi", url: '#' },
            { title: "Denda & Sanksi", url: '#' },
          ],
        },
        {
          title: "Layanan Mandiri",
          url: "#",
          icon: FileText,
          items: [
            { title: "Validasi Turnitin", url: '/admin/turnitin/process' },
            { title: "Bebas Pustaka", url: '/admin/bebas-pustaka' },
            { title: "Usulan Buku Baru", url: '#' },
          ],
        },
        {
          title: "Pesan Masuk",
          url: '#',
          icon: Mail,
        },
      ],
    },
    {
      id: "users",
      title: "Manajemen Pengguna",
      icon: Users,
      menus: [
        {
          title: "Keanggotaan",
          url: "#",
          icon: UserCheck,
          items: [
            { title: "Data Mahasiswa", url: '/admin/student' },
            { title: "Data Dosen", url: '/admin/lecturers' },
            { title: "Staf Universitas", url: '/admin/staff' },
            { title: "Anggota Luar", url: '#' },
          ],
        },
        {
          title: "Hak Akses",
          url: '#',
          icon: Settings2,
        },
      ],
    },
  ]

  const isUrlActive = (menuUrl: string, items?: unknown[]) => {
    if (url === menuUrl) return true
    if (items) {
      return items.some(item => url.startsWith(
        .url) && item.url !== '#')
    }
    return url.startsWith(menuUrl) && menuUrl !== '#'
  }

  const activeTabByUrl = navigationData.find(tab =>
    tab.menus.some(menu => isUrlActive(menu.url, (menu as any).items))
  )

  const secondaryNav = [
    { title: "Pusat Bantuan", url: "#", icon: LifeBuoy },
    { title: "Kirim Feedback", url: "#", icon: Send },
  ]

  const [activeTab, setActiveTab] = React.useState(navigationData[0])

  React.useEffect(() => {
    if (activeTabByUrl) {
      setActiveTab(activeTabByUrl)
    }
  }, [url])

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r bg-sidebar"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <Link href={dashboard().url}>
                  <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg mx-auto">
                    <LibraryBig className="size-4" />
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {navigationData.map((tab) => (
                <SidebarMenuItem key={tab.id}>
                  <SidebarMenuButton
                    tooltip={tab.title}
                    onClick={() => {
                      setActiveTab(tab)
                      setOpen(true)
                    }}
                    isActive={activeTab.id === tab.id}
                    className="px-2.5 md:px-2"
                  >
                    <tab.icon />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>

      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="border-b p-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-foreground uppercase tracking-tight">
              {activeTab.title}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Sipustaka v1.0</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <div className="px-4 py-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Menu Navigasi</p>
            <NavMain items={activeTab.menus} />
          </div>
          <NavSecondary items={secondaryNav} className="mt-auto border-t" />
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}