import React from 'react';
import Tooltip from '@semcore/tooltip';
import { Box, Flex } from '@semcore/flex-box';
import Link from '@semcore/link';

export default () => (
  <Flex>
    <Box m="auto" p={5}>
      <Tooltip title="Hello, stranger 😉">
        <Link>Trigger</Link>
      </Tooltip>
    </Box>
  </Flex>
);
