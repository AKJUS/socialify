import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Row, Col, notification } from 'antd'

import ConfigType, {
  Font,
  Theme,
  Pattern,
  FileType
} from '../../common/types/configType'
import ConfigContext from '../contexts/ConfigContext'
import { repoQueryResponse } from '../../common/relay/__generated__/repoQuery.graphql'

import Config from './configuration/config'
import Preview from './preview/preview'

import styles from './mainWrapper.module.css'

type MainWrapperProps = {
  response: repoQueryResponse | null
}

const MainWrapper = ({ response }: MainWrapperProps) => {
  const router = useRouter()
  const [config, setConfig] = useState<ConfigType>({
    name: '',
    logo: '',
    font: Font.inter,
    theme: Theme.dark,
    pattern: Pattern.plus,
    fileType: FileType.png
  })

  const setConfigHelper = (config: ConfigType) => {
    setConfig(config)
  }

  useEffect(() => {
    if (!response || !response.repository) {
      router.push('/')
      notification.error({
        message: 'Error',
        description: 'GitHub repository is not found.'
      })
    }
  }, [response, router])

  if (response && response.repository) {
    const { repository } = response

    return (
      <ConfigContext.Provider value={{ config, setConfig: setConfigHelper }}>
        <Row className={styles.mainWrapper}>
          <Col span={24} order={2} xl={{ span: 12, order: 1 }}>
            <Config repository={repository} />
          </Col>
          <Col span={24} order={1} xl={{ span: 12, order: 2 }}>
            <Preview />
          </Col>
        </Row>
      </ConfigContext.Provider>
    )
  } else {
    return null
  }
}
export default MainWrapper
