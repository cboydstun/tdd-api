import { Clock, Shield, Package, DollarSign, LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: Clock,
    title: "Timely Service",
    description:
      "Free delivery between 8 AM - 10 AM with pickup between 6 PM - 8 PM",
  },
  {
    icon: Shield,
    title: "Safe & Clean",
    description:
      "All equipment thoroughly sanitized and safety-inspected before every rental",
  },
  {
    icon: Package,
    title: "No Deposit Required",
    description:
      "No deposit needed for rentals inside Loop 1604 in San Antonio",
  },
  {
    icon: DollarSign,
    title: "Competitive Pricing",
    description:
      "Daily rates starting from $99.95 with free delivery and setup",
  },
];
