import * as fs from 'fs';
import * as path from 'path';
import type { I18nRepository } from '../../domain/repositories/i18n.repository';

export class JsonI18nRepository implements I18nRepository {
  private readonly messagesByLocale: Map<string, Record<string, string>> =
    new Map();
  private readonly locales: string[] = [];

  constructor(messagesDir: string) {
    const absDir = path.isAbsolute(messagesDir)
      ? messagesDir
      : path.join(process.cwd(), messagesDir);
    if (!fs.existsSync(absDir)) return;
    const files = fs.readdirSync(absDir).filter((f) => f.endsWith('.json'));
    for (const file of files) {
      const locale = path.basename(file, '.json');
      try {
        const raw = fs.readFileSync(path.join(absDir, file), 'utf-8');
        const json = JSON.parse(raw) as Record<string, string>;
        this.messagesByLocale.set(locale, json);
        this.locales.push(locale);
      } catch {}
    }
  }

  getLocales(): string[] {
    return [...this.locales];
  }

  getMessages(locale: string): Record<string, string> {
    return this.messagesByLocale.get(locale) ?? {};
  }
}
