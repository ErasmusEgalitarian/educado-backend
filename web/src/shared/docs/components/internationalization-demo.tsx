import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/shadcn/button";
import { Card } from "@/shared/components/shadcn/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn/select";

import { ComponentDemo } from "./component-demo";

/* ----------------------- Documentation Props ----------------------- */
const translationProps = [
  {
    name: "t",
    type: "(key: string) => string",
    description:
      "Translation function that retrieves the translated string for a given key.",
  },
  {
    name: "i18n",
    type: "i18n",
    description:
      "The i18n instance with methods like changeLanguage(), language, etc.",
  },
];

const setupSteps = [
  {
    name: "1. Import useTranslation",
    type: "import",
    description: "Import the hook from react-i18next at the top of your file.",
  },
  {
    name: "2. Initialize in component",
    type: "hook",
    description: "Call useTranslation() to get the translation function.",
  },
  {
    name: "3. Use translation keys",
    type: "usage",
    description:
      "Use t() function with dot notation to access nested translation keys.",
  },
];

/* ----------------------- Examples ----------------------- */
const examples = [
  {
    title: "Basic Usage",
    description: "Simple translation of a static key.",
    code: `import { useTranslation } from "react-i18next";

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <h1>{t("common.edit")}</h1>;
  // Renders: "Edit" (en) or "Editar" (pt)
};`,
    preview: (
      <Card className="p-6">
        <BasicTranslationExample />
      </Card>
    ),
  },
  {
    title: "Nested Keys",
    description: "Access deeply nested translation keys using dot notation.",
    code: `const { t } = useTranslation();

// Access nested keys
<p>{t("language.portuguese")}</p>
<p>{t("language.english")}</p>
<p>{t("common.saveChanges")}</p>
<p>{t("courseManager.generalInfo")}</p>`,
    preview: (
      <Card className="p-6">
        <NestedKeysExample />
      </Card>
    ),
  },
  {
    title: "Dynamic Content",
    description: "Build dynamic content using multiple translations.",
    code: `const { t } = useTranslation();
const isEditMode = true;
const courseName = "React Basics";

const title = isEditMode 
  ? \`\${t("common.edit")} \${t("courseManager.course")} '\${courseName}'\`
  : \`\${t("common.create")} \${t("courseManager.course")}\`;

return <h1>{title}</h1>;
// Edit mode: "Edit Course 'React Basics'" (en)
// Create mode: "Create Course" (en)`,
    preview: (
      <Card className="p-6">
        <DynamicContentExample />
      </Card>
    ),
  },
  {
    title: "Language Switcher",
    description: "Change the application language programmatically.",
    code: `import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    void i18n.changeLanguage(lng);
  };

  return (
    <div>
      <button onClick={() => changeLanguage("en")}>
        English
      </button>
      <button onClick={() => changeLanguage("pt")}>
        Português
      </button>
      <p>Current: {i18n.language}</p>
    </div>
  );
};`,
    preview: (
      <Card className="p-6">
        <LanguageSwitcherExample />
      </Card>
    ),
  },
];

/* ----------------------- Example Components ----------------------- */
function BasicTranslationExample() {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        <strong>Key:</strong> common.edit
      </p>
      <h2 className="text-2xl font-bold">{t("common.edit")}</h2>
    </div>
  );
}

function NestedKeysExample() {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm text-muted-foreground">language.portuguese</p>
        <p className="font-medium">{t("language.portuguese")}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">language.english</p>
        <p className="font-medium">{t("language.english")}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">common.saveChanges</p>
        <p className="font-medium">{t("common.saveChanges")}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">actions.search</p>
        <p className="font-medium">{t("actions.search")}</p>
      </div>
    </div>
  );
}

function DynamicContentExample() {
  const { t } = useTranslation();
  const [isEditMode, setIsEditMode] = useState(true);
  const courseName = "React Basics";

  const getTitle = () => {
    if (isEditMode) {
      return `${t("common.edit")} ${t("courseManager.course")} '${courseName}'`;
    }
    return `${t("common.create")} ${t("courseManager.course")}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant={isEditMode ? "primary" : "outline"}
          onClick={() => setIsEditMode(true)}
        >
          Edit Mode
        </Button>
        <Button
          size="sm"
          variant={!isEditMode ? "primary" : "outline"}
          onClick={() => setIsEditMode(false)}
        >
          Create Mode
        </Button>
      </div>
      <div className="p-4 bg-muted rounded-md">
        <h2 className="text-xl font-bold">{getTitle()}</h2>
      </div>
    </div>
  );
}

function LanguageSwitcherExample() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    void i18n.changeLanguage(lng);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select value={i18n.language} onValueChange={changeLanguage}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="pt">Português</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="p-4 bg-muted rounded-md space-y-2">
        <p>
          <strong>{t("language.switchLanguage")}:</strong> {i18n.language}
        </p>
        <p>
          <strong>{t("common.edit")}:</strong> {t("common.edit")}
        </p>
        <p>
          <strong>{t("common.save")}:</strong> {t("common.save")}
        </p>
        <p>
          <strong>{t("common.cancel")}:</strong> {t("common.cancel")}
        </p>
      </div>
    </div>
  );
}

/* ----------------------- Translation File Structure ----------------------- */
const TranslationStructure = () => {
  return (
    <div className="space-y-6 mt-6">
      <div>
        <h3 className="text-xl font-semibold mb-3">
          Translation File Structure
        </h3>
        <p className="text-muted-foreground mb-4">
          Translation files are located in <code>i18n/locales/</code> and
          organized as JSON objects with nested keys.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* English File */}
        <Card className="p-4">
          <h4 className="font-semibold mb-2">en.json (English)</h4>
          <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
            {`{
  "common": {
    "edit": "Edit",
    "delete": "Delete",
    "create": "Create",
    "save": "Save",
    "cancel": "Cancel"
  },
  "actions": {
    "search": "Search",
    "close": "Close",
    "selectAll": "Select all"
  },
  "language": {
    "portuguese": "Portuguese",
    "english": "English"
  }
}`}
          </pre>
        </Card>

        {/* Portuguese File */}
        <Card className="p-4">
          <h4 className="font-semibold mb-2">pt.json (Português)</h4>
          <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
            {`{
  "common": {
    "edit": "Editar",
    "delete": "Deletar",
    "create": "Criar",
    "save": "Salvar",
    "cancel": "Cancelar"
  },
  "actions": {
    "search": "Buscar",
    "close": "Fechar",
    "selectAll": "Selecionar tudo"
  },
  "language": {
    "portuguese": "Português",
    "english": "Inglês"
  }
}`}
          </pre>
        </Card>
      </div>
    </div>
  );
};

/* ----------------------- Best Practices ----------------------- */
const BestPractices = () => {
  return (
    <div className="space-y-6 mt-6">
      <div>
        <h3 className="text-xl font-semibold mb-3">Best Practices</h3>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <h4 className="font-semibold text-green-600 mb-2">✓ Do</h4>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Use descriptive, hierarchical keys (e.g., common.save)</li>
            <li>Keep translation keys consistent across both languages</li>
            <li>Group related translations under common namespaces</li>
            <li>Extract all user-facing text to translation files</li>
            <li>Use lowercase for translation keys</li>
            <li>Test your app in both languages regularly</li>
          </ul>
        </Card>

        <Card className="p-4">
          <h4 className="font-semibold text-red-600 mb-2">✗ Don't</h4>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Hardcode strings directly in JSX (use t() instead)</li>
            <li>Create deeply nested keys (max 3 levels recommended)</li>
            <li>Duplicate translation keys across different sections</li>
            <li>Forget to add translations in all language files</li>
            <li>Use special characters or spaces in keys</li>
            <li>Mix languages in a single translation file</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

/* ----------------------- Adding New Translations ----------------------- */
const AddingTranslations = () => {
  return (
    <div className="space-y-6 mt-6">
      <div>
        <h3 className="text-xl font-semibold mb-3">Adding New Translations</h3>
        <p className="text-muted-foreground mb-4">
          Follow these steps to add new translations to the application:
        </p>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <h4 className="font-semibold mb-2">Step 1: Add to en.json</h4>
          <p className="text-sm text-muted-foreground mb-2">
            Add your key-value pair to <code>i18n/locales/en.json</code>
          </p>
          <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
            {`{
  "myFeature": {
    "title": "My Feature Title",
    "description": "This is a description",
    "buttonLabel": "Click Me"
  }
}`}
          </pre>
        </Card>

        <Card className="p-4">
          <h4 className="font-semibold mb-2">Step 2: Add to pt.json</h4>
          <p className="text-sm text-muted-foreground mb-2">
            Add the Portuguese translation to <code>i18n/locales/pt.json</code>
          </p>
          <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
            {`{
  "myFeature": {
    "title": "Título do Meu Recurso",
    "description": "Esta é uma descrição",
    "buttonLabel": "Clique Aqui"
  }
}`}
          </pre>
        </Card>

        <Card className="p-4">
          <h4 className="font-semibold mb-2">Step 3: Use in Component</h4>
          <p className="text-sm text-muted-foreground mb-2">
            Import and use the translation in your component
          </p>
          <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
            {`import { useTranslation } from "react-i18next";

const MyFeature = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t("myFeature.title")}</h1>
      <p>{t("myFeature.description")}</p>
      <button>{t("myFeature.buttonLabel")}</button>
    </div>
  );
};`}
          </pre>
        </Card>
      </div>
    </div>
  );
};

/* ----------------------- Main Component ----------------------- */
export const InternationalizationDemo = () => {
  return (
    <div className="space-y-8">
      <ComponentDemo
        componentName="Internationalization (i18n)"
        description="Learn how to use translations in the application with useTranslation hook and manage multiple languages."
        props={translationProps}
        examples={examples}
      />

      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">Setup Steps</h3>
        <div className="grid gap-4">
          {setupSteps.map((step) => (
            <Card key={step.name} className="p-4">
              <h4 className="font-semibold mb-1">{step.name}</h4>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <TranslationStructure />
      <AddingTranslations />
      <BestPractices />

      <Card className="p-6 bg-blue-50 dark:bg-blue-950">
        <h4 className="font-semibold mb-2">💡 Pro Tip</h4>
        <p className="text-sm">
          The default language is Portuguese (pt). You can change the default
          language in <code>i18n/i18n.ts</code> by modifying the{" "}
          <code>fallbackLng</code> and <code>lng</code> properties.
        </p>
      </Card>
    </div>
  );
};

export default InternationalizationDemo;
