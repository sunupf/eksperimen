require "selenium-webdriver"

class BeforeTest
  def initialize(testCase,driver)
    @testCase =  testCase
    @driver =  driver
  end
  def run
    # @driver.manage.window.maximize
    @driver.get "http://todo.app/"
    element = @driver.find_element :css => '[name="email"]'
    element.send_keys "john@doe.com"

    element = @driver.find_element :css => '[name="password"]'
    element.send_keys "qweasd123"

    buttonSubmit = @driver.find_element :css => ".uk-button-primary"
    buttonSubmit.click

    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { @driver.find_element(:css => '#todo-list').displayed? }

    url = @testCase['testCases']['target'];
    splitedUrl = url.split("=");
    if(splitedUrl.length > 1)
      id = splitedUrl.last
    else
      id = 0
    end

    todo = @driver.find_elements :css => "#todo-#{id} .title"
    if todo.empty?
      todo = @driver.find_elements :css => "#todo-list li:last-child a"
    end
    todo[0].click
  end
end
