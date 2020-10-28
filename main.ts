import {
	App,
	MarkdownSourceView,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting, TFile,
	WorkspaceLeaf
} from 'obsidian';

export default class MyPlugin extends Plugin {
	onInit() {

	}

	onload() {
		console.log('Copy Markdown loading');

		this.addCommand({
			id: 'copy-markdown',
			name: 'copy',
			checkCallback: (checking: boolean) => {
				let view = this.app.workspace.activeLeaf.view;
				if (view instanceof MarkdownView) {
				    if (!checking) {
						this.copyMarkdown(view)
					}
					return true;
				}
				return false;
			}
		});
	}

	onunload() {
		console.log('Copy Markdown unloading');
	}

	replaceWikiLink(files: TFile[], text: string): string {
		const name = text.match(/\[\[(.+)\]\]/)[1].replace(/\#.+/, '')
		const path = files.filter(file => file.basename === name)[0]?.path || name

		return `[${name}](${encodeURIComponent(path)})`
	}

	replaceWikiLinkWithAlias(files: TFile[], text: string): string {
        const alias = text.replace(/^.+?\|/,'').replace(']]', '');
		const name = text.replace('[[','').replace(/\|.+/, '').replace(/\#.+/, '');
		const path = files.filter(file => file.basename === name)[0]?.path || name

		return `[${alias}](${encodeURIComponent(path)})`
	}

	copyMarkdown(view: MarkdownView) {
		const files = this.app.vault.getFiles()
		const content = view.sourceMode.cmEditor.getDoc().getValue()
			.replace(/\[\[(.+?)\|(.+?)\]\]/g, this.replaceWikiLinkWithAlias.bind(this, files))
			.replace(/\[\[(.+?)\]\]/g, this.replaceWikiLink.bind(this, files))

		navigator.clipboard.writeText(content)
	}
}
