export type ActiveMenuOption = 'binder';
export type BinderItem = DirectoryItem | SnippetItem;

export interface MenuState {
    activeMenu: ActiveMenuOption;
}

interface BinderItemBase {
    id: number;
    name: string;
}

export interface DirectoryItem extends BinderItemBase {
    type: 'directory';
    directory_id: number | null;
}

export interface SnippetItem extends BinderItemBase {
    type: 'snippet';
    directory_id: number | null;
    content?: string;
}