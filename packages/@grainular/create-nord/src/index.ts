#!/usr/bin/env node
import { intro, outro } from '@clack/prompts';
import { clear } from 'node:console';
import { styleText } from 'node:util';
import pkg from '../package.json';
import { createBrowserTemplate } from './steps/create-browser-template';
import { createViteTemplate } from './steps/create-vite-template';
import { projectDetails } from './steps/project-details';
import { templateOptions } from './steps/template-options';

// Clearing the console of all previous
// artifacts to allow focus and space for
// the scaffolding run.
clear();

// Displaying the intro text here to have
// a nice greeting
const version = styleText(['dim', 'gray'], `(v${pkg.version})`);
intro(styleText(['bold'], `🚀 Hej! Scaffolding a new Nørd Application: ${version}`));

// We require a project directory and / or
// name to start the scaffolding process,
// as well as the correct template type and
// all other information required.
const { path, name } = await projectDetails();
const { type, additionalDependencies, useRolldown } = await templateOptions();

// We can then invoke the correct template creator
switch (type) {
    case 'browser':
        await createBrowserTemplate({ path, name });
        break;
    case 'vite':
        await createViteTemplate('vite', { path, name, type, additionalDependencies, useRolldown });
        break;
    case 'vite-ts':
        await createViteTemplate('vite-ts', { path, name, type, additionalDependencies, useRolldown });
        break;
}

// After that, we can log additional information
// if so required and then display the outro text
outro('Complete! 🚀');
