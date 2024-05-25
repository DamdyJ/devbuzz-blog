import { Slash } from "lucide-react";
import React from "react";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "./ui/breadcrumb";

export type BreadcrumbItemType = {
    label: string;
    href: string;
};

type DynamicBreadcrumbsProps = {
    list: BreadcrumbItemType[];
};
export default function DynamicBreadcrumbs({ list }: DynamicBreadcrumbsProps) {
    return (
        <>
            <Breadcrumb>
                <BreadcrumbList>
                    {list.map((item, index) => (
                        <React.Fragment key={index}>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={item.href}>
                                    {item.label}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <Slash />
                            </BreadcrumbSeparator>
                        </React.Fragment>
                    ))}
                    <BreadcrumbItem>
                        <BreadcrumbPage>...</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </>
    );
}
