// Icons
import {
    mdiWalletBifoldOutline,
    mdiMedicalBag,
    mdiTshirtCrewOutline,
    mdiLaptop,
    mdiBookshelf,
} from '@mdi/js';

interface CategoryInfo {
	icon: string,
	br ?: string,
}

interface CategoryMap {
	[key: string]: CategoryInfo,
}

const categories: CategoryMap = {
    'Selecione a categoria': {
        'icon': mdiWalletBifoldOutline,
        'br': 'Selecione a categoria',
    },
    'personal finance': {
        'icon': mdiWalletBifoldOutline,
        'br': 'Finanças pessoais',
    },
    'health and workplace safety': {
        'icon': mdiMedicalBag,
        'br': 'Saúde e Segurança no Trabalho',
    },
    'sewing': {
        'icon': mdiTshirtCrewOutline,
        'br': 'Costura',
    },
    'electronics': {
        'icon': mdiLaptop,
        'br': 'Eletrônica',
    },
    default: {
        'icon': mdiBookshelf,
    }
}

export default categories;