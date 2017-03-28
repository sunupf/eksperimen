require "selenium-webdriver"

class BeforeTest
  def initialize(testCase,driver)
    @testCase =  testCase
    @driver =  driver
  end
  def run
    # Here some example
    @driver.manage.window.maximize
    @driver.get "http://todo.app/"
    element = @driver.find_element :css => '[name="email"]'
    element.send_keys "john@doe.com"

    element = @driver.find_element :css => '[name="password"]'
    element.send_keys "qweasd123"

    buttonSubmit = @driver.find_element :css => ".uk-button-primary"
    buttonSubmit.click

    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { @driver.find_element(:css => '#todo-list').displayed? }


    url = @testCase['testCases']["target"].split("#").first
    ids = @testCase['testCases']["target"].split("#").last.split("/")

    id = ids.first
    todoId = ids.last
  

    todo = @driver.find_elements :css => "#todo-#{todoId} .title"
    if todo.empty?
      todo = @driver.find_elements :css => "#todo-list li:last-child a"
    end
    todo[0].click

    wait.until { @driver.find_element(:css => '#activity-list').displayed? }

    activities = @driver.find_elements :css => "#activity-#{id} h4 a"
    if activities.empty?
      activities = @driver.find_elements :css => "#activity-list li:first-child h4 a"
    end
    activities[0].click
  end
end
