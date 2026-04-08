import { Head } from '@inertiajs/react';
import { Plus, LayoutGrid, Image as ImageIcon } from 'lucide-react';
import { useState, useCallback } from 'react';
import AddServicesModal from '@/components/admin/services/AddServicesModal';
import { columns } from '@/components/admin/services/columns';
import { DataTable } from '@/components/admin/services/data-table';
import EditServiceModal from '@/components/admin/services/EditServicesModal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import serviceRoute from '@/routes/service';

// Interface sudah disesuaikan dengan database
export interface Service {
    id: number;
    icon: string;
    title: string;
    subtitle: string;
    description: string | null;
    features: string[] | null;
    link: string;
    order: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Services',
        href: serviceRoute.index(),
    },
];

interface ServicesProps {
    services: Service[];
}

export default function ServicesIndex({ services }: ServicesProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const handleEdit = useCallback((service: Service) => {
        setSelectedService(service);
        setIsEditModalOpen(true);
    }, []);

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        // Delay nulling untuk animasi transisi modal yang mulus
        setTimeout(() => setSelectedService(null), 200);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Layanan" />

            <div className="flex flex-col gap-6 p-6">
                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <ImageIcon className="h-5 w-5 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Daftar Layanan
                            </h1>
                        </div>
                        <p className="text-muted-foreground">
                            Kelola layanan dan unggah ikon/foto untuk tampilan landing page.
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="shadow-sm transition-all hover:shadow-md"
                        size="lg"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Tambah Layanan
                    </Button>
                </div>

                {/* DATA TABLE SECTION */}
                <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                    <DataTable
                        columns={columns(handleEdit)}
                        data={services}
                        searchKey="title"
                    />
                </div>
            </div>

            {/* MODALS */}
            <AddServicesModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            {selectedService && (
                <EditServiceModal
                    isOpen={isEditModalOpen}
                    service={selectedService}
                    onClose={closeEditModal}
                />
            )}
        </AppLayout>
    );
}