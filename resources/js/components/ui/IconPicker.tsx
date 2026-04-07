import * as Icons from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


// Daftar ikon populer agar tidak terlalu berat saat render awal
const popularIcons = [
    "Rocket", "Shield", "Star", "Heart", "Settings", "User", "Mail",
    "Bell", "Camera", "Cloud", "Cpu", "Database", "Fingerprint",
    "Gift", "Globe", "Home", "Image", "Key", "Layers", "Layout",
    "LifeBuoy", "Link", "Lock", "Map", "Monitor", "Package", "Phone"
];

interface IconPickerProps {
    value: string;
    onChange: (iconName: string) => void;
}

export const IconPicker = ({ value, onChange }: IconPickerProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const SelectedIcon = (Icons as any)[value] || Icons.HelpCircle;

    // Filter ikon berdasarkan input user
    const filteredIcons = popularIcons.filter((name) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <SelectedIcon className="h-4 w-4" />
                        <span>{value || "Pilih Ikon"}</span>
                    </div>
                    <Icons.ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-2">
                <Input
                    placeholder="Cari ikon..."
                    className="mb-2 h-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ScrollArea className="h-60">
                    <div className="grid grid-cols-5 gap-1">
                        {filteredIcons.map((name) => {
                            const Icon = (Icons as any)[name];
                            return (
                                <Button
                                    key={name}
                                    variant={value === name ? "default" : "ghost"}
                                    size="icon"
                                    className="h-10 w-10"
                                    onClick={() => onChange(name)}
                                >
                                    <Icon className="h-5 w-5" />
                                </Button>
                            );
                        })}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};