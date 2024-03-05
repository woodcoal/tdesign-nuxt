import { addComponent, addImportsSources, tryResolveModule } from '@nuxt/kit';
import { join } from 'path';

import { componentMap, pluginList, iconList } from './config';
import { map, kebabCase } from 'lodash-es';
import { isExclude } from './utils';

import type { ModuleOptions } from './interface';

/**
 * auto import components
 */
export const resolveTDesignComponents = (options: ModuleOptions) => {
  const moduleMode = options.esm ? 'esm' : 'es';
  const prefix = options.prefix ?? 't';

  map(componentMap, (subComponents: string[], keys: string) => {
    subComponents.forEach((component) => {
      if (!isExclude(component, options.exclude)) {
        addComponent({
          name: `${prefix}-${kebabCase(component)}`,
          // export:''
          filePath: `tdesign-vue-next/${moduleMode}/${keys}/index`
        });
      }
    });
  });
};

/**
 * auto import plugins
 */
export const resolveTDesignPlugins = (options: ModuleOptions) => {
  const moduleMode = options.esm ? 'esm' : 'es';
  const plugins = options.plugins ?? pluginList;
  addImportsSources({
    imports: plugins,
    from: `tdesign-vue-next/${moduleMode}`
  });
};

/**
 * auto import icon from tdesign-icons-vue-next
 */
export const resolveTDesignIcons = (options: ModuleOptions) => {
  map(iconList, (icon: string) => {
    if (!isExclude(icon, options.iconExclude)) {
      const iconName = options.iconPrefix ? `${options.iconPrefix}-${kebabCase(icon)}-icon` : `${kebabCase(icon)}-icon`;
      const iconFilePath = kebabCase(icon);

      addComponent({
        name: iconName,
        // export:''
        filePath: `tdesign-icons-vue-next/esm/components/${iconFilePath}`
      });
    }
  });
};

/**
 * auto import global css variables
 */
export const resolveTDesignVariables = async (options: ModuleOptions, nuxt: any) => {
  const stylePath = options.esm ? '../esm/style/index.js' : '../es/style/index.css';

  const tdesignGlobalStyle = await tryResolveModule('tdesign-vue-next/package.json').then((tdLocation) => (tdLocation ? join(tdLocation, stylePath) : Promise.reject('Unable to resolve tdesign-vue-next Global Style. Is it installed?')));
  nuxt.options.css.push(tdesignGlobalStyle);
};
