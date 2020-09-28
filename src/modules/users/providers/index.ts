import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptsHashProvider from './HashProvider/implementations/BCryptsHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptsHashProvider);
