# Сначала добавить remote для shared-components репозитория

git remote add shared-components git@github.com:IgorChugurov/shared-components.git

# Добавить shared-components как subtree

git subtree add --prefix=src/shared-components shared-components main

# Когда нужно будет получить обновления:

git subtree pull --prefix=src/shared-components shared-components main --squash

использование git subtree pull --prefix=src/shared-components shared-components main --squash будет наиболее подходящим решением в вашем случае, если:

Текущий проект всегда считается "источником правды" (source of truth):
Вы работаете в одном проекте в данный момент и хотите, чтобы изменения из него распространялись на другие проекты.

Вы не хотите разбираться с конфликтами истории или детализированной историей коммитов:
--squash позволяет вам объединять изменения в один новый коммит, игнорируя историю изменений из других проектов, что упрощает процесс синхронизации.

# Чтобы отправить изменения в репозиторий shared-components:

git subtree push --prefix=src/shared-components shared-components main
