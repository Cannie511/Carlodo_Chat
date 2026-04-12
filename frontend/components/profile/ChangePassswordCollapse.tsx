import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDownIcon } from "lucide-react"
import { ReactNode } from "react";

interface ChangePasswordCollapseProps { 
    title: string;
    section: ReactNode;
    icon: ReactNode;
}

export function ChangePasswordCollapse({ title, section, icon}: ChangePasswordCollapseProps) {
  return (
    <Collapsible className="rounded-md data-[state=open]:bg-muted px-2 py-1">
        <CollapsibleTrigger asChild>
        <Button variant={'completeGhost'} className="group w-full">
           <div className="flex items-center space-x-4">
             {icon}
              <span className="text-md">{title}</span>
           </div>
            <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180 transition-transform duration-200" />
        </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col items-start gap-2 p-3 text-sm">
          <div className="w-full">
              {section}
          </div>
        </CollapsibleContent>
    </Collapsible>
  )
}
