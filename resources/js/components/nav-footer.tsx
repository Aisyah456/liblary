"use client"

import { Link } from '@inertiajs/react';
import { type LucideIcon } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

interface FooterItem {
    title: string;
    url: string;
    icon: LucideIcon;
}

export function NavFooter({
    items = [], // Default ke array kosong jika data tidak ada
    className
}: {
    items: FooterItem[],
    className?: string
}) {
    // Jika items null/undefined atau kosong, jangan render apapun
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <SidebarGroup className={className}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item, index) => {
                        // Safety check: Jika item itu sendiri undefined, skip
                        if (!item) return null;

                        // Ambil URL dengan aman (fallback ke '#' jika kosong)
                        const url = item.url || '#';
                        const isExternal = url.startsWith('http');

                        // Gunakan index sebagai key cadangan jika title tidak ada
                        const key = item.title || index;

                        return (
                            <SidebarMenuItem key={key}>
                                <SidebarMenuButton asChild size="sm" tooltip={item.title}>
                                    {isExternal ? (
                                        <a href={url} target="_blank" rel="noopener noreferrer">
                                            {item.icon && <item.icon className="size-4" />}
                                            <span>{item.title}</span>
                                        </a>
                                    ) : (
                                        <Link href={url}>
                                            {item.icon && <item.icon className="size-4" />}
                                            <span>{item.title}</span>
                                        </Link>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}