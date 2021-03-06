import Request from '@/utils/request'
import Configs from '@/configs'

const endpoint = `${Configs.API_URL}/api/v1`

const MainApi = Request.create({
  endpoint,
  handleToken: true
})

export { MainApi }
