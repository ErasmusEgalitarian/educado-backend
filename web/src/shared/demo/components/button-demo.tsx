import {
  mdiAccount,
  mdiArrowRight,
  mdiCog,
  mdiFire,
  mdiHome,
  mdiRefresh,
} from "@mdi/js";
import Icon from "@mdi/react";

import { Button } from "@/shared/components/shadcn/button";

import { ComponentDemo } from "./component-demo";

import type React from "react";

// Button prop metadata (primitive)
const buttonProps = [
  {
    name: "variant",
    type: '"primary" | "secondary" | "destructive" | "outline" | "ghost" | "link"',
    default: '"primary"',
    description: "Visual style of the button.",
  },
  {
    name: "effect",
    type: '"expandIcon" | "ringHover" | "shine" | "shineHover" | "gooeyRight" | "gooeyLeft" | "underline" | "hoverUnderline" | "gradientSlideShow"',
    description: "Optional visual / interaction effect.",
  },
  {
    name: "size",
    type: '"default" | "sm" | "lg" | "icon"',
    default: '"default"',
    description: "Predefined size variants.",
  },
  {
    name: "icon",
    type: "React.ElementType",
    description: "Component to render as an icon (used with iconPlacement).",
  },
  {
    name: "iconPlacement",
    type: '"left" | "right"',
    description: "Where to render the icon when provided.",
  },
  {
    name: "asChild",
    type: "boolean",
    description: "Render the button as a Slot to wrap custom components.",
  },
  { name: "disabled", type: "boolean", description: "Disable interactions." },
  {
    name: "type",
    type: '"button" | "submit" | "reset"',
    default: '"button"',
    description: "Native button type attribute.",
  },
];

interface Example {
  title: string;
  description?: string;
  code: string;
  preview: React.ReactNode;
}

const examples: Example[] = [
  {
    title: "Variants",
    description: "All standard variant styles.",
    code: `<Button>Primary</Button>\n<Button variant="secondary">Secondary</Button>\n<Button variant="destructive">Destructive</Button>\n<Button variant="outline">Outline</Button>\n<Button variant="ghost">Ghost</Button>\n<Button variant="link">Link</Button>`,
    preview: (
      <div className="flex flex-wrap gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    ),
  },
  {
    title: "Sizes",
    description: "Size variants including icon size.",
    code: `<Button size="sm">Small</Button>\n<Button size="default">Default</Button>\n<Button size="lg">Large</Button>\n<Button size="icon"><Icon path={mdiHome} size={1} /></Button>`,
    preview: (
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Home">
          <Icon path={mdiHome} size={1} />
        </Button>
      </div>
    ),
  },
  {
    title: "Icons & Placement",
    description: "Using icon + placement (left / right).",
    code: `<Button icon={HomeIcon} iconPlacement="left">Home</Button>\n<Button icon={ArrowRightIcon} iconPlacement="right">Continue</Button>`,
    preview: (
      <div className="flex flex-wrap gap-3">
        <Button
          icon={() => <Icon path={mdiHome} size={1} />}
          iconPlacement="left"
        >
          Home
        </Button>
        <Button
          icon={() => <Icon path={mdiArrowRight} size={1} />}
          iconPlacement="right"
        >
          Continue
        </Button>
      </div>
    ),
  },
  {
    title: "Effects",
    description: "Selection of available effect styles.",
    code: `<Button effect="ringHover">Ring Hover</Button>\n<Button effect="shine">Shine</Button>\n<Button effect="shineHover">Shine Hover</Button>\n<Button effect="expandIcon" icon={SettingsIcon} iconPlacement="left">Settings</Button>\n<Button effect="gooeyRight">Gooey Right</Button>\n<Button effect="gooeyLeft">Gooey Left</Button>\n<Button effect="underline" variant="link">Underline</Button>\n<Button effect="hoverUnderline" variant="link">Hover Underline</Button>\n<Button effect="gradientSlideShow">Gradient</Button>`,
    preview: (
      <div className="flex flex-wrap gap-3">
        <Button effect="ringHover">Ring Hover</Button>
        <Button effect="shine">Shine</Button>
        <Button effect="shineHover">Shine Hover</Button>
        <Button
          effect="expandIcon"
          icon={() => <Icon path={mdiCog} size={1} />}
          iconPlacement="left"
        >
          Settings
        </Button>
        <Button effect="gooeyRight">Gooey Right</Button>
        <Button effect="gooeyLeft">Gooey Left</Button>
        <Button effect="underline" variant="link">
          Underline
        </Button>
        <Button effect="hoverUnderline" variant="link">
          Hover Underline
        </Button>
        <Button effect="gradientSlideShow">Gradient</Button>
      </div>
    ),
  },
  {
    title: "Disabled States",
    description: "Disabled variant examples.",
    code: `<Button disabled>Primary</Button>\n<Button variant="secondary" disabled>Secondary</Button>\n<Button variant="outline" disabled>Outline</Button>`,
    preview: (
      <div className="flex flex-wrap gap-3">
        <Button disabled>Primary</Button>
        <Button variant="secondary" disabled>
          Secondary
        </Button>
        <Button variant="outline" disabled>
          Outline
        </Button>
      </div>
    ),
  },
  {
    title: "As Child (Slot)",
    description: "Render arbitrary element via asChild prop.",
    code: `import { Link } from 'react-router-dom'\n\n<Button asChild><Link to="/dashboard">Dashboard</Link></Button>`,
    preview: (
      <div className="flex gap-3">
        <Button asChild>
          <a href="#dashboard">Dashboard Link</a>
        </Button>
      </div>
    ),
  },
  {
    title: "Icon Only Palette",
    description: "Icon-only buttons across variants.",
    code: `<Button size="icon"><Icon path={mdiHome} size={1} /></Button>\n<Button size="icon" variant="secondary"><Icon path={mdiAccount} size={1} /></Button>\n<Button size="icon" variant="outline"><Icon path={mdiCog} size={1} /></Button>\n<Button size="icon" variant="ghost"><Icon path={mdiRefresh} size={1} /></Button>\n<Button size="icon" variant="destructive"><Icon path={mdiFire} size={1} /></Button>`,
    preview: (
      <div className="flex flex-wrap gap-3">
        <Button size="icon" aria-label="Home">
          <Icon path={mdiHome} size={1} />
        </Button>
        <Button size="icon" variant="secondary" aria-label="Account">
          <Icon path={mdiAccount} size={1} />
        </Button>
        <Button size="icon" variant="outline" aria-label="Settings">
          <Icon path={mdiCog} size={1} />
        </Button>
        <Button size="icon" variant="ghost" aria-label="Refresh">
          <Icon path={mdiRefresh} size={1} />
        </Button>
        <Button size="icon" variant="destructive" aria-label="Danger">
          <Icon path={mdiFire} size={1} />
        </Button>
      </div>
    ),
  },
];

export const ButtonDemo = () => (
  <ComponentDemo
    componentName="Button"
    description="Highly composable button component with variants, sizes, effects, and icon support."
    props={buttonProps}
    examples={examples}
  />
);

export default ButtonDemo;
