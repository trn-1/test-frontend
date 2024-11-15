# Code Style

В данном документе рассматриваются общие вопросы оформления кода, регламент создания компонентов, а так же общепринятые на проекте практики. Следование данным практикам позволит быстрее пройти код-ревью 🤓.

#### Содержание

[Настройки тулинга](#tooling)  
[Структура файлов](#files)  
[Именование](#naming)  
[Core Components](#core)  
[Вынесение логики компонента](#logic)  
[Стилизация](#style)  
[Создание redux стора](#redux)

## <a id="tooling">Настройки тулинга</a>

На данном проекте используется eslint, но с набором необходимого минимума. По сути, мы используем рекомендованные настройки как самого eslint, так и плагинов для typescript, react, react-hooks. Это позволяет не загонять разработчиков в строгие рамки правил популярных гайдов, как например, популярные правила от airbnb. В большистве случаев полагаемся на общую читаемость и понятность кода.
Некоторые правила отключены, из важных `react-hooks/exhaustive-deps`. Всё остальное дефолтные правила принятые в сообществе.

Так же на проекте используется prettier в дефолтной конфигурации.

Перед коммитом код будет проверен в eslint и отформатирован prettier. Но, можно поставить соотвествующие плагины для своей IDE и тогда все их ворнинги будут видны в редакторе кода, а prettier будет форматировать текст при сохранении.

Для редактора VSCode можно установить расширение [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) которое будет исправлять ошибки в написании английских слов.

## <a id="files">Структура файлов</a>

Все новые создаваемые компоненты должны быть отдельной директории с название компонента в формате kebab-case, а файл компонента с названием в формате pascal-case. Например:

```
my-component/
├─ MyComponent.tsx
```

```tsx
// MyComponent.tsx
export default function MyComponent() {
  return <h1>Hello</h1>
}
```

В этом случае директория компонента становится модулем этого компонента, а значит нам нужно экпортировать то, что мы хотим публично открыть из этого модуля. Добавляем index.ts

```
my-component/
├─ MyComponent.tsx
├─ index.ts
```

```ts
//index.ts
export { default as MyComponent } from './MyComponent'
```

Если компонент содержит какие-то утилитарные функции или объявления типов, то их можно вынести в отдельные файлы расположив рядом с компонентом. Уточнение по поводу файла types: там хранятся типы, которые используются только в этом компоненте и в его вложенных компонентах. Например, мы в родительском компоненте получаем какие-то данные и на основе их создаём другие, для отображения во вложенных компонентах и больше нигде. И в types мы можем описать их интерфейсы. В данном случае нам может быть не обязательно выносить их в модели, т.к. это утилитарные типы данного компонента. Выглядеть компонент с этими файлами может так:

```
my-component/
├─ MyComponent.tsx
├─ index.ts
├─ utils.ts
├─ types.ts
```

Если какое-то содержимое этих файлов должно быть открыто наружу модуля, то так же их экспортируем через index.ts

```ts
//index.ts
export { default as MyComponent } from './MyComponent'
export { getBoxDimensions } from './utils.ts'
export { type TBox } from './types.ts'
```

Если компонент состоит из нескольких компонентов, то создаём для них отдельную папку components с index.ts внутри для описания экспорта

```
my-component/
├─ components/
│  ├─ fancy-header/
│  │  ├─ FancyHeader.tsx
│  ├─ index.ts
├─ index.ts
├─ MyComponent.tsx
├─ types.ts
├─ utils.ts
```

Если компонент создаёт свой контекст, то его можно расположить возле самого компонента

```
my-component/
├─ components/
│  ├─ fancy-header/
│  │  ├─ FancyHeader.tsx
│  ├─ index.ts
├─ index.ts
├─ MyComponent.tsx
├─ MyComponentContext.tsx
├─ types.ts
├─ utils.ts
```

Если какой-то компонент в папке components созданного компонента является переиспользуемым другими компонентами из этой же папки components, то он должен быть вынесен с ними на один уровень, т.е. в корень папки components.
Например, у нас есть компонент, который имеет шапку и подвал, в котором выводятся разные даты проведенной операции приёмки. Сам компонент отображающий дату вывода `OperationDate` был выделен в отдельный компонент, и чтобы его переиспользовать двум клиентскими компонентами вынесем его на уровень этих компонентов

```
my-component/
├─ components/
│  ├─ header/
│  │  ├─ Header.tsx
│  ├─ footer/
│  │  ├─ Footer.tsx
│  ├─ operation-date/
│  │  ├─ OperationDate.tsx
│  ├─ index.ts
├─ index.ts
├─ MyComponent.tsx

```

Файлы стилей должны лежать рядом с компонентом и называться Styles или по названию компонента

```
my-component/
├─ index.ts
├─ MyComponent.tsx
├─ Styles.module.scss

my-component/
├─ index.ts
├─ MyComponent.tsx
├─ MyComponent.module.scss
```

## <a id="naming">Именование</a>

> «В компьютерных науках есть только две сложные проблемы – аннулирование кэша и придумывание названий» — Фил Карлтон

1. Потому следует придумывать названия для сущностей максимально приближенных к бизнес-процессу, в контексте которого они существуют. Например, если компонент отображает в поповере информацию о контрагенте, то его название может быть **ContractorInfoPopover**.

2. Так же при именовании нужно использовать его визуальную часть, например, если мы создаём кнопку, то в названии компонента это желательно добавить в конце названия **ContractorInfoButton**.

3. При именовании пропсов компонента имеющих в постфиксе названия общих html-элементов, таких как кнопка или элементы формы, следует и названия этих пропсов давать более приближенные к общему API этих элементов. Например, если создаваемый компонент - это кнопка и у него есть пропса получающая хендлер для обработки события клика, то эта пропса будет называеться `onClick` как и у обычной кнопки. Компоненты, визуально представляющие из себя элементы формы могут, при необходимости, иметь пропсы `onChange, value, ...etc`

   ```tsx
   <InfoButton onClick={} disabled={} />
   ```

4. Также внутри компонента при описании бизнес-логики имеющую несколько сложных условий можно объединить эти условия в отдельные переменные с названием выражающих их общую суть.

   Например:

   Допустим, у нас есть ответ с бека с объектом, обозначающим включена ли для данного договора бонусная система и количество полученных бонусов. Объект выглядит так: `{bonusesEnabled: boolean, sum: number}`
   И нам нужно их вывести, если они есть.

   ```tsx
   // Пока ничего сложного
   if (bonuses && bonuses.bonusesEnabled && bonuses.sum !== 0) {
   }
   //Допустим, у нас добавляется еще один компонент, который зависит от наличия бонусов. Тогда условие станет сложнее.
   if (bonuses && bonuses.bonusesEnabled && bonuses.sum !== 0 && someValue) {
   }
   //А если зависимых компонентов еще больше, то больше вот таких мест в коде будет встречаться.

   //Давайте это выражение вынесем в логическую переменную, которую можно использовать вместо первоначального сравнения
   const hasBonuses = bonuses && bonuses.bonusesEnabled && bonuses.sum !== 0

   if (hasBonuses) {
   }
   if (hasBonuses && someValue) {
   }
   ```

5. При именовании функций хендлеров следует придерживаться такого правила: при объявлении давать ей префикс `handle`

   ```tsx
   const handleSetMassStatus = () => {
     //...
   }

   return <Button onClick={handleSetMassStatus} />
   ```

   А если мы его передаём в дочерний компонент, то именуем как колбек ивента, с префиксом `on`

   ```tsx
   const handleSetMassStatus = () => {
     //...
   }

   return <SomeComponent onSetMassStatus={handleSetMassStatus} />
   ```

6. Функции, получающие данные посредством запросов на бек, должны иметь в названии префикс `fetch` вместо `get`, например, `fetchData`, `fetchBonuses`, за исключением функций-обёрток над axios, там get показывает метод запроса.

## <a id="core">Core Components</a>

Это особые компоненты, расчиатнные на максимальное переиспользование на других страницах и не привязанные к определенному контексту. Как правило, это комопонет "сам в себе" не содержищих внешних зависимостей и содержащий всю необходимую логику в себе. Т.е. его можно просто взять и начать сразу использовать в любом другом месте проекта.

Поэтому, если нужно что-то изменить в core компоненте, то нельзя в него добавлять селекторы на получение данных из redux или какого-то стороннего react-контекста. Только через пропсы.

Исключением являются селекторы, получающие данные из core редьюсеров, т.е. доступных на всех страницах.

## <a id="logic">Вынесение логики компонента</a>

Чтобы компоненты были более легкочитаемы, при необходимости, можно часть функциноала или логики вынести из компонента, чтобы она не мешала пониманию логики отрисовки компонента.

Некоторые функции, которые не содержат своего стейта и сами не получают данные из внешних источников, а всего-лишь хелперы помогающие что-то вычислить, отфильтровать или отформатировать, можно вынести в отдельно лежаший файл `utils.ts` этого компонента.

Если часть логики которую нужно вынести содержит свой стейт или обращения к внешним API или редакс стору или контексту, то в таком случае можно создать кастомный хук и переместить всю необходимую логику в него. В такому случае хук должен лежать рядом с компонентом и называться по имени компонента с приставкой `use`, по правилам именования хуков. Например, компонент из которого выносим логику называется ContractorInfoPopover, то хук его логикой будет useContractorInfoPopover. Важное условие - он должен быть один. Подключение других кастомных хуков в таком случае в данном компоненте не возможны.

## <a id="style">Стилизация</a>

1. Основные единицы измерения - пиксели
2. Именование классов в формате pascal-case
3. Если стилизуемый компонент содержит несколько элементов, то описываем стили по правилам БЭМ

```scss
.Root {
  &__controls {
    //...
  }

  &__input {
    //...
  }

  &__label {
    //...
    &_large {
      // это модификатор
      //...
    }
  }
}
```

4. Не забываем про тёмную тему оформления, которую можно стилизовать с использование миксина `dark-theme-only`

```scss
.Root {
  background-color: $sepia5;

  @include dark-theme-only {
    background-color: $sepia3;
  }
}
```

5. В разработке используем компоненты библиотеки [Blueprint](https://blueprintjs.com/docs/versions/3/#blueprint)

6. При создании кастомных компонентов нужно максимально придерживаться дизайна библиотеки Blueprint. И в этом поможет переиспользование его элементов:

   - [colors](https://blueprintjs.com/docs/versions/3/#core/colors)
   - [variables](https://blueprintjs.com/docs/versions/3/#core/variables)
   - intent доступны в `import { Intent } from '@blueprintjs/core'`
   - [icons](https://blueprintjs.com/docs/versions/3/#icons) доступны в `import { IconNames } from '@blueprintjs/icons'`
   - [classes](https://blueprintjs.com/docs/versions/3/#core/classes) доступны в `import { Classes } from '@blueprintjs/core'`

7. К сожалению, как оказалось, еще довольно много клиентов используют устаревшие браузеры и поэтому использование такого свойства как `gap` нежелательно. Вместо него можно использовать миксин `item-list`, который принимает первым параметром направление, а вторым расстояние, тот же самый gap.  
   Например, вот так можно заменить

   ```scss
   @import '~core/styles/mixins';

   // исходный код колонки с gap
   .ColumnWithGap {
     display: flex;
     flex-direction: column;
     gap: 10px;
   }
   // вариант колонки без gap
   .ColumnWithItemList {
     @include item-list(column, 10px);
   }
   // исходный код ряда с gap
   .RowWithGap {
     display: flex;
     flex-direction: row;
     gap: 10px;
   }
   // вариант ряда без gap
   .RowWithItemList {
     @include item-list(row, 10px);
   }
   ```

## <a id="redux">Создание redux стора</a>

Рассмотрим на примере.

Допустим, нам нужно выполнить запрос на внешний api и сохранить результаты в глобальном хранилище в отельном слайсе redux стейта.

Описываем функцию получения данных. Вызовы всех апишек хранятся в `src/core/api`

```ts
// src/core/api/contractors.ts

/**
 * Получить статус клиента по идентификатору статуса
 * @param statusId айди статуса, по которому нужно получить информацию
 */
export function getStatusById(statusId: number): Promise<ContractorStatus> {
  return axiosRequestGET(`/ajaxRoute/customers/status/${statusId}`)
}
```

При необходимости описываем возращаемый тип в моделях. `src/core/models`

```ts
// src/core/models/contractor.ts

export type ContractorStatus = {
  //...
}
```

Далее создаём слайс для хранения ответа.
Создаём директорию для слайса `store/modules/contractors` и общий файл со ссылкой на слайс

```ts
// store/modules/contractors/common.ts
import { withGlobalPrefix } from 'core/common/redux'

export const moduleKey = 'contractors'
export const reducerPrefix = withGlobalPrefix(moduleKey)
```

Экшен для него

```ts
// store/modules/contractors/actions.ts
import { createAsyncThunk } from '@reduxjs/toolkit'

import ContractorApi from 'core/api/contractors'
import logger from 'core/common/logger'

import { reducerPrefix } from './common'

const FETCH_CONTRACTOR_STATUS = `${reducerPrefix}/FETCH_CONTRACTOR_STATUS`
export const fetchContractorStatusById = createAsyncThunk(
  FETCH_CONTRACTOR_STATUS,
  async (statusId: number, { rejectWithValue }) => {
    try {
      return await ContractorApi.getStatusById(statusId)
    } catch (e) {
      logger.error(e)
      return rejectWithValue(e)
    }
  }
)
```

ну и сам слайс хранилища, тут всё стандартно

```ts
// store/modules/contractors/actions.ts
import { createSlice } from '@reduxjs/toolkit'

import { ContractorsState } from 'core/store/types/modules/contractors'

import { fetchContractorStatusById } from './actions'
import { reducerPrefix } from './common'

const initialState: ContractorsState = {
  contractors: {},
  statuses: {},
}

const contractorsState = createSlice({
  name: reducerPrefix,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(fetchContractorStatusById.fulfilled, (state, action) => {
      const id = action.meta.arg

      state.statuses[id] = action.payload
    }),
})

export const { reducer } = contractorsState
```

На что еще тут обратить внимание, так это на то, что интерфейс стора должен хранится в отдельном файле для типов.

```ts
// /store/types/contractors.ts

export type ContractorsState = {
  //...
}
```

И добавляем этот интерфейс к типу `TRootState` если это core стейт

```ts
// /store/types/index.ts
import { moduleKey as contractorsKey } from '../modules/contractors/common'
import { ContractorsState } from './contractors'

export type TRootState = {
  //...
  [contractorsKey]: ContractorsState
}
```

или подключаем к стору нужной страницы в Root.tsx роутера данной страницы

```ts
export default function Root() {
  //...

  if (!isInjected.current) {
    // ...
    store.injectReducer(contractorsKey, ContractorsReducer)
  }

  //...
}
```

Создаём для него селектор

```ts
// store/modules/contractors/selectors.ts
import { ModuleSelector } from 'core/interfaces/utils'
import { TRootState } from 'core/store/types'
import { ContractorsState } from 'core/store/types/contractors'

import { moduleKey } from './common'

function moduleSelector<T extends unknown[], R>(
  selector: ModuleSelector<ContractorsState, T, R>
) {
  return (globalState: TRootState, ...args: T) =>
    selector(globalState[moduleKey], ...args)
}

export const selectContractorStatusById = moduleSelector(
  (state, statusId?: number) => {
    if (!statusId) {
      return null
    }
    return state.statuses[statusId]
  }
)
```
