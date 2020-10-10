import React from 'react';
import { HorizontalLine } from './HorizontalLine';

export const Author = () => (
    <div style={{ paddingTop: '1rem' }}>
        <HorizontalLine />
        <p>
            With <span role="img" aria-labelledby='love'>❤️</span> from <a href='https://ioanzicu.netlify.app/' target='blank' style={{ color: 'inherit' }} >
                Ioan Zîcu</a>
        </p>
        <HorizontalLine />
    </div>
);