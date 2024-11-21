# Сначала добавить remote для shared-components репозитория

git remote add shared-components git@github.com:IgorChugurov/shared-components.git

# Добавить shared-components как subtree

git subtree add --prefix=src/shared-components shared-components main

# Когда нужно будет получить обновления:

git subtree pull --prefix=src/shared-components shared-components main

# Чтобы отправить изменения в репозиторий shared-components:

git subtree push --prefix=src/shared-components shared-components main
