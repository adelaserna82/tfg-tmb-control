import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Site } from "./types/site";
import { useGetAllSites } from "@/api/generated/sites";
import { siteDtoToSite } from "./types/adapters";
import SitesSkeleton from "./components/skeletons/SitesSkeleton";
import SiteFormSkeleton from "./components/skeletons/SiteFormSkeleton";
import SiteForm from "./components/SiteForm";
import SiteList from "./components/SiteList";
import { FaCompress  } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";



type Mode = "create" | "edit" | null;

const initialFormData: Site = { id: "", name: "", href: "", description: "" };

export default function SitesPage() {
    const [mode, setMode] = useState<Mode>(null);
    const [formData, setFormData] = useState<Site>(initialFormData);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { data: resp, isLoading } = useGetAllSites();
    const allSites = (resp?.data ?? []).map(siteDtoToSite);

    const handleEditSite = (site: Site) => {
        setMode("edit");
        setFormData(site);
        setDrawerOpen(true);
    };

    const handleNewSite = () => {
        setMode("create");
        setFormData(initialFormData);
        setDrawerOpen(true);
    };

    return (
        <>
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-3xl font-bold text-gray-800">Enlaces a Sitios Web</h1>
            </div>
            <div className="flex p-6 bg-gray-900 text-white rounded-lg shadow-lg relative">
                <button
                    onClick={handleNewSite}
                    className="md:hidden fixed bottom-8 right-8 z-20 bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition"
                    aria-label="Nuevo sitio"
                >
                    <FaPlus/>
                </button>
                <div className="flex-1 pr-1 md:pr-6 md:border-r border-gray-700 overflow-y-auto min-h-[50vh] max-h-[75vh] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                    {isLoading ? (
                        <SitesSkeleton />
                    ) : allSites.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center">No hay sitios disponibles.</p>
                    ) : (
                        <SiteList sites={allSites} onEdit={handleEditSite} />
                    )}
                </div>
                <div className="w-1/3 pl-6 hidden md:block">
                    {isLoading ? (
                        <SiteFormSkeleton />
                    ) : (
                        <SiteForm
                            mode={mode}
                            setMode={setMode}
                            formData={formData}
                            setFormData={setFormData}
                        />
                    )}
                </div>
            </div>
            <Dialog open={drawerOpen} onClose={() => setDrawerOpen(false)} className="relative z-50 md:hidden">
                <div
                    className="fixed inset-0 bg-black/30"
                    aria-hidden="true"
                    onClick={() => setDrawerOpen(false)}
                />
                <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-gray-900 p-4 overflow-y-auto shadow-xl">
                    <button
                        className="mb-4 text-white ml-auto flex justify-end"
                        onClick={() => setDrawerOpen(false)}
                        aria-label="Cerrar formulario"
                    >
                        <span className="sr-only">Cerrar formulario</span>
                        <FaCompress className="text-lg rotate-45" />
                    </button>
                    <SiteForm
                        mode={mode}
                        setMode={(m) => {
                            setMode(m);
                            if (!m) setDrawerOpen(false);
                        }}
                        formData={formData}
                        setFormData={setFormData}
                    />
                </div>
            </Dialog>
        </>
    );
}